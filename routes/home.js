const express = require('express');
const authController = require('../Controller/authController')
const router = express.Router();


/* GET home page. */
router.get('/', authController.checkLog, (req, res, next) => {
  res.render('home');
});

module.exports = router;