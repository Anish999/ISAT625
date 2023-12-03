const asyncHandler = require('express-async-handler')

const Subscription = require('../models/subscriptionModel')


//@desc Add a topic
//@route POST /api/topics
//@access Private
const addSubscription = asyncHandler(async (req, res) => {
    const {user, topic} = req.body;
    if(!req.body.user){
        res.status(400)
        throw new Error('User not logged in.')
    }
    if(!req.body.topic){
        res.status(400)
        throw new Error('Topic not selected.')
    }
    const newSubscription = await Subscription.create({
        user: user,
        topic:topic
    })
    res.status(200).json(newSubscription);
})

const removeSubscription = asyncHandler(async (req, res) => {
    const {user, topic} = req.body;
    if(!req.body.user){
        res.status(400)
        throw new Error('User not logged in.')
    }
    if(!req.body.topic){
        res.status(400)
        throw new Error('Topic not selected.')
    }
    const subscription = await Subscription.findOne({user: user,topic:topic})
    await subscription.deleteOne()
    res.status(200).json(req.body.topic)
})

module.exports = {addSubscription,removeSubscription}