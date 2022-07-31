const authController = require('../Controller/authController')
const router = require('express').Router();


// register User

router
    .get('/signup', authController.checkLog, authController.getSignup)
    .post('/signup', authController.postSignup);

// sign in
router
    .get('/signin', authController.checkLog, authController.getSignin)
    .post('/signin', authController.postSignin);
router.get('/logout', authController.logout);

module.exports = router