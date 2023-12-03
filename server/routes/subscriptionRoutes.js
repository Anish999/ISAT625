const express = require('express')
const {addSubscription, removeSubscription } = require('../controllers/subscriptionController')

const router = express.Router()

router.route('/').post(addSubscription);
router.route('/unsubscribe').post(removeSubscription);

module.exports = router