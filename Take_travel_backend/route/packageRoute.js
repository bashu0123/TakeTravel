const express = require('express');
const authController = require('../controller/authController');
const packageController = require('../controller/packageController');
const router = express.Router();

// Public routes - available without authentication
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackage);

// All routes after this middleware are protected
router.use(authController.protect);

// Create middleware to check if user is admin
const restrictToAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to perform this action'
    });
  }
  next();
};


router.patch('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);
router.delete('/:id/permanent', packageController.permanentlyDeletePackage);

// Admin-only routes
// router.use(restrictToAdmin);

router.post('/', packageController.addPackage);

module.exports = router;