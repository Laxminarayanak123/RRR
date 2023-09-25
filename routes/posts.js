const express = require('express');

const { Module } = require('module');

const router = express.Router();

const postController = require('../controllers/postController');

 

const commentController = require('../controllers/commentController');



router.post('/',postController.PostConroller);

 

router.post('/comment',commentController.commentController);

router.post('/comment/delete/',commentController.deleteComment);

router.post('/delete/:uID/:pID/',postController.deletePost);

router.post('/download/:id', postController.download)



module.exports = router;