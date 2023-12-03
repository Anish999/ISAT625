const express = require('express')
const { createPost, getPosts} = require('../controllers/postController')

const router = express.Router()

router.route('/').post(createPost);
router.route('/getPosts').post(getPosts)

module.exports = router