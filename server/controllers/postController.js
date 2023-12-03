const asyncHandler = require('express-async-handler')

const Post = require('../models/postModel')
const Topic = require('../models/topicModel')
const Subscription = require('../models/subscriptionModel')

//@desc Get all posts
//@route GET /api/posts
//@access Private
const getPosts = asyncHandler(async (req, res) => {
    const {_id} = req.body;

    const subscriptions = await Subscription.find({user: _id},{_id:0,user:0, createdAt:0, updatedAt:0, __v:0});
    const subscribedTopics = await subscriptions.map(s => s.topic);

    const posts = await Post.find({topic: { $in: subscribedTopics}}).sort({ createdAt: 'desc' })

    // Extract topic IDs from the posts
    const topicIds = posts.map(post => post.topic.toString());

    // Fetch topics from the Topic collection based on topic IDs
    const topics = await Topic.find({ _id: { $in: topicIds } });

    // Create a map of topic IDs to names for easier lookup
    const topicIdToNameMap = topics.reduce((acc, topic) => {
        acc[topic._id] = topic.name;
        return acc;
    }, {});

    // Modify the posts array to include the topic names for each post
    const postsWithTopics = posts.map(post => ({
        ...post.toObject(), // Convert Mongoose document to plain object
        topicName: topicIdToNameMap[post.topic]
    }));
    res.status(200).json(postsWithTopics);
})

//@desc Get subscribed posts
//@route GET /api/posts
//@access Private
const getSubscribedPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({user:req.user.id})
    res.status(200).json(posts);
})

//@desc Create new post
//@route POST /api/posts
//@access Private
const createPost = asyncHandler(async (req, res) => {
    const {text, title,topic,user,isNewTopic} = req.body;
    if(!text){
        res.status(400)
        throw new Error('Please add a text field!')
    }
    if(!title){
        res.status(400)
        throw new Error('Please add a title!')
    }
    if(!topic){
        res.status(400)
        throw new Error('Please add or select a topic!')
    }

    if(isNewTopic){
        const newTopic = await Topic.create({
            name : req.body.topic
        })
        if(newTopic){
            await Subscription.create({
                user: user,
                topic:newTopic._id
            })
            const post = await Post.create({
                title: title,
                text: text,
                createdBy: user,
                topic: newTopic._id
            })
            res.status(200).json(post);
        }
        else{
            res.status(400)
            throw new Error('New Topic could not be added.')
        }
    } else{
        //check if subscription exist 
        const exist = await Subscription.find({topic: topic, user:user});
        if(exist.length == 0){
            await Subscription.create({
                user: user,
                topic:topic
            })
        }
        const post = await Post.create({
            title: title,
            text: text,
            createdBy: user,
            topic: topic
        })
        res.status(200).json(post);
    }
})

//@desc Update goal
//@route PUT /api/goals/:id
//@access Private
const updatePost = asyncHandler(async (req, res) => {
    const goal = await Post.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await Post.findById(req.user.id)
    
    //Check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure the logged in user matches the goal user
    if(goal.user.toString() != user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Post.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedGoal);
})

//@desc Delete goal
//@route DELETE /api/goals/:id
//@access Private
const deletePost = asyncHandler(async (req, res) => {
    const goal = await Post.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await Post.findById(req.user.id)
    
    //Check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    //Make sure the logged in user matches the goal user
    if(goal.user.toString() != user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await goal.deleteOne();
    res.status(200).json({id: req.params.id});
})

module.exports = {
    getPosts, getSubscribedPosts, createPost, updatePost, deletePost
}