const Booking = require('../model/bookingModel');
const Package = require('../model/packageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../model/userModel');

exports.getAvailableGuides = catchAsync(async (req, res, next) => {
  const guides = await User.find({ role: 'guide' }).select('name _id');
  
  res.status(200).json({
    status: 'success',
    results: guides.length,
    data: {
      guides
    }
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
    console.log(`working`)
  const package = await Package.findById(req.body.packageId);
  console.log(`package is :${package} `)
  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + package.duration);

  const booking = await Booking.create({
    packageId: req.body.packageId,
    userId: req.body.userId,
    startDate,
    endDate,
    totalPrice: package.price,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.assignGuide = catchAsync(async (req, res, next) => {
  if (!req.body.guideId) {
    return next(new AppError('Please provide guide ID', 400));
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      guideId: req.body.guideId,
      status: 'confirmed'
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.getGuideBookings = catchAsync(async (req, res, next) => {
  const { guideId } = req.body; // Get guideId from request body

  if (!guideId) {
    return res.status(400).json({ status: 'fail', message: 'Guide ID is required' });
  }

  const bookings = await Booking.find({ guideId })
  .populate({ path: 'packageId', select: 'imageBase64 name duration price' })
  .populate({ path: 'userId', select: 'name email' })
  .populate({ path: 'guideId', select: 'name' });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings }
  });
});


exports.getUserBookings = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ status: 'fail', message: 'User not found' });
  }

  const bookings = await Booking.find({ userId })
    .populate({ path: 'packageId', select: 'imageBase64 name duration price' })
    .populate({ path: 'userId', select: 'name email' })
    .populate({ path: 'guideId', select: 'name' });
    console.log(bookings);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings }
  });
});


exports.getGuideAnalytics = catchAsync(async (req, res, next) => {
  const guideId = req.user._id;
  const currentDate = new Date();
  
  // Get start of current month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Get tours this month
  const toursThisMonth = await Booking.countDocuments({
    guideId,
    startDate: { $gte: startOfMonth },
    status: 'confirmed'
  });

  // Get upcoming tours
  const upcomingTours = await Booking.countDocuments({
    guideId,
    startDate: { $gte: currentDate },
    status: 'confirmed'
  });

  // Get total travelers for upcoming tours
  const totalTravelers = await Booking.aggregate([
    {
      $match: {
        guideId: mongoose.Types.ObjectId(guideId),
        startDate: { $gte: currentDate },
        status: 'confirmed'
      }
    },
    {
      $lookup: {
        from: 'packages',
        localField: 'packageId',
        foreignField: '_id',
        as: 'package'
      }
    },
    {
      $group: {
        _id: null,
        totalTravelers: { $sum: { $arrayElemAt: ['$package.maxGroupSize', 0] } }
      }
    }
  ]);

  // Get tours per month for the last 6 months
  const toursPerMonth = await Booking.aggregate([
    {
      $match: {
        guideId: mongoose.Types.ObjectId(guideId),
        status: 'confirmed',
        startDate: {
          $gte: new Date(new Date().setMonth(currentDate.getMonth() - 5))
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$startDate' },
          year: { $year: '$startDate' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1
      }
    }
  ]);

  // Get language distribution
  const languageDistribution = await Booking.aggregate([
    {
      $match: {
        guideId: mongoose.Types.ObjectId(guideId),
        status: 'confirmed'
      }
    },
    {
      $lookup: {
        from: 'packages',
        localField: 'packageId',
        foreignField: '_id',
        as: 'package'
      }
    },
    {
      $unwind: '$package'
    },
    {
      $group: {
        _id: '$package.language',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get upcoming reminders
  const upcomingBookings = await Booking.find({
    guideId,
    startDate: { $gte: currentDate },
    status: 'confirmed'
  })
  .populate('packageId', 'name')
  .sort('startDate')
  .limit(5);

  const reminders = upcomingBookings.map(booking => ({
    tourName: booking.packageId.name,
    startDate: booking.startDate,
    reminder: getDefaultReminder(booking.startDate)
  }));

  res.status(200).json({
    status: 'success',
    data: {
      quickStats: {
        toursThisMonth,
        upcomingTours,
        totalTravelers: totalTravelers[0]?.totalTravelers || 0
      },
      toursPerMonth,
      languageDistribution,
      reminders
    }
  });
});

// Helper function to get default reminder based on tour date
const getDefaultReminder = (tourDate) => {
  const now = new Date();
  const daysDifference = Math.ceil((tourDate - now) / (1000 * 60 * 60 * 24));

  if (daysDifference <= 1) {
    return 'Contact clients for meeting point confirmation';
  } else if (daysDifference <= 7) {
    return 'Check weather conditions and prepare equipment';
  }
  return 'Review tour details and requirements';
};
