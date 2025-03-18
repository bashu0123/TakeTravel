const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const router = express.Router();


router.get('/',userController.getAllUsers)
router.get('/all-guides',userController.getAllGuides)
router.post('/signup', authController.signup);
router.post('/signup/guide', authController.signupGuide);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/:userId/verify', userController.approveGuide);
router.delete('/:userId', userController.rejectGuide);
// protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getUser);

module.exports = router;