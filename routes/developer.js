const express = require('express');

const router = express.Router();

const developerCOntroller = require('../controllers/developerController');


router.get('/',developerCOntroller.Developer);

router.post('/suggest',developerCOntroller.Suggest);

router.get('/data',developerCOntroller.GetFeedback);


module.exports = router;
