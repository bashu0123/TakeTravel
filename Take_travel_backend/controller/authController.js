const crypto = require('crypto');
const sendMail = require('../utils/SendEmailSMTP');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '100d' });

const createSendToken = (user, statusCode, res, next) => {
  try {
    const token = signToken(user._id); // `signToken` will now include expiresIn

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000), // Cookie expiry
      httpOnly: true,
      sameSite: "none"
    });

    // Ensure sensitive fields are not exposed
    user.password = undefined;

    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        jwtExpiresIn: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000) // Same expiry info in the response
      }
    });
  } catch (err) {
    console.error("Error in createSendToken:", err); // Log error for debugging

    if (next && typeof next === "function") {
      return next(new AppError('Token creation failed, please try again later.', 500));
    }

    return res.status(500).json({ status: 'fail', message: 'Token creation failed, please try again later.' });
  }
};

exports.signupGuide = catchAsync(async (req, res, next) => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  // Validate guide-specific fields
  if (!req.body.phoneNumber || !req.body.experience || !req.body.specialization) {
    return next(new AppError('Please provide all required guide information', 400));
  }

  const newGuide = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: 'guide',
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    experience: req.body.experience,
    languages: req.body.languages || ['English'],
    specialization: req.body.specialization,
    token: verificationToken
  });

  newGuide.save();
  // await sendMail({ email: req.body.email, url: `${process.env.fagoon_url}/verifyEmail/${verificationToken}`, type: "signup" });
  res.status(201).json({ status: 'success', message: 'Guide Registered' });
});

exports.signup = catchAsync(async (req, res, next) => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordChangedAt: req.body.passwordChangedAt,
    token: verificationToken
  });
  newUser.save()
//   await sendMail({ email: req.body.email, url: `${process.env.fagoon_url}/verifyEmail/${verificationToken}`, type: "signup" });
  res.status(201).json({ status: 'success', message: 'User Registered' });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ token: req.params.verificationToken }, { verified: true });
  if (!user) return res.status(404).json({ status: 'fail', message: 'User Not found.' });
  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please enter email and password' });
}
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
}
//   if (!user.verified) return res.status(401).json({ status: 'fail', message: 'User Email Not verified.' });
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', domain: '.fagoondigital.com', sameSite: 'none', path: '/' });
  res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const freshUser = await User.findById(decoded.id);
      if (!freshUser || freshUser.changedPasswordAfter(decoded.iat)) return next();
      res.locals.user = freshUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('No user found with that email address.', 404));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    await sendMail({ email: req.body.email, url: `${req.body.url || process.env.default_url}/resetPassword/${resetToken}`, type: "forgotPassword" });
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Error sending email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('Token is invalid or expired', 400));
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) return next(new AppError('Current password is incorrect', 401));
  user.password = req.body.password;
  await user.save();
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token) return next(new AppError('You are not logged in!', 401));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let freshUser = await User.findById(decoded.id);
  if (!freshUser) return next(new AppError('User no longer exists', 401));
  if (freshUser.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed password, log in again', 401));
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});
