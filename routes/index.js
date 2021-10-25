var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => res.redirect('/inventory'));

module.exports = router;
