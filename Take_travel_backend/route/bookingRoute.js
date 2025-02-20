const express = require('express');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');
const router = express.Router();

router.get('/available-guides', bookingController.getAvailableGuides);
router.post('/guide-bookings', bookingController.getGuideBookings);
router.post('/user-bookings', bookingController.getUserBookings);
router.get('/guide-analytics', bookingController.getGuideAnalytics);
router.use(authController.protect);

router.post('/', bookingController.createBooking);
// router.get('/my-bookings', bookingController.getMyBookings);

router.use(authController.restrictTo('admin', 'superadmin'));

router.get('/getAllBookings', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', bookingController.updateBooking);
router.patch('/:id/assign-guide', bookingController.assignGuide);

module.exports = router;