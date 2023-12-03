const asyncHandler = require('express-async-handler')

const Topic = require('../models/topicModel')
const Subscription = require('../models/subscriptionModel')

//@desc Get topics
//@route GET /api/topics
//@access Private
const getTopics = asyncHandler(async (req, res) => {
    const {_id} = req.body;
    let subscribedTopics = [];

    const topics = await Topic.find({},{createdAt:0, updatedAt:0, __v:0})
    if(_id){
        const subscriptions = await Subscription.find({user: _id});
        subscribedTopics = subscriptions.map(s => s.topic.toString())
    }
    const topicsWithSubscriptionStatus = topics.map(topic => {
        const isSubscribed = subscribedTopics.includes(topic._id.toString()); // Assuming topic._id is an ObjectId
        return { ...topic.toObject(), subscribed: isSubscribed };
    });

    const sortedTopics = topicsWithSubscriptionStatus.sort((a, b) => (b.subscribed - a.subscribed));

    res.status(200).json(sortedTopics);
})

//@desc Add a topic
//@route POST /api/topics
//@access Private
const createTopic = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error('Please add a text field!')
    }
    const topic = await Topic.create({
        name: req.body.name
    })
    res.status(200).json(topic);
})

module.exports = {getTopics, createTopic}