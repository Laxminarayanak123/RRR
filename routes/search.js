const express = require('express');

const passport = require('passport');

const router = express.Router();

const SearchController = require('../controllers/searchController');

router.post('/',SearchController.SearchController);

module.exports = router;