const express = require('express')
const { getTopics, createTopic} = require('../controllers/topicController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(getTopics).post(protect,createTopic);
router.route('/getTopic').post(getTopics);

module.exports = router