const Package = require('../model/packageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.addPackage = catchAsync(async (req, res, next) => {
  // The image should already be base64 encoded from the frontend
  const newPackage = await Package.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      package: newPackage
    }
  });
});

exports.getAllPackages = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ isActive: true });
  
  res.status(200).json({
    status: 'success',
    results: packages.length,
    data: {
      packages
    }
  });
});

exports.getPackage = catchAsync(async (req, res, next) => {
  const package = await Package.findById(req.params.id);
  
  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      package
    }
  });
});

exports.updatePackage = catchAsync(async (req, res, next) => {
  const package = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      package
    }
  });
});

exports.deletePackage = catchAsync(async (req, res, next) => {
  // Instead of actually deleting, just set isActive to false
  const package = await Package.findByIdAndUpdate(req.params.id, 
    { isActive: false },
    { new: true }
  );
  
  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Truly delete a package (admin only)
exports.permanentlyDeletePackage = catchAsync(async (req, res, next) => {
  const package = await Package.findByIdAndDelete(req.params.id);
  
  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});