const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Topic = require('../models/topicModel');
const Subscription = require('../models/subscriptionModel');
const { error } = require('console');

//@desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req,res) => {
    const username = req.body.username;
    const topics = req.body.topics;
    if(!username){
        res.status(400);
        throw new Error('Please add a value for username')
    }
    //check if user exists
    const userExists = await User.findOne({username});
    if(userExists){
        res.status(400);
        throw new Error('Username already taken')
    }
    //Create user
    const user = await User.create({
        username
    })
    //get All Topics ID
    //const getTopics = await Topic.find({name: {$in: topics}}, '_id').exec();
    if(user){
        //Create subscription
        topics.forEach(async (topic) => {
            await Subscription.create({
                user: user._id,
                topic: topic
            })
        });
        res.status(201).json({
            _id: user.id,
            username: user.username
        })
    }else{
        res.status(400);
        throw new Error('Invalid User Data')
    }
})

//@desc Authenticate user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req,res) => {
    const username = req.body.username

    //Check for Username
    const user = await User.findOne({username})

    if(user){
        res.status(200).json({
            _id: user.id,
            username: user.username
        })
    } else {
        res.status(400);
        throw new Error('Invalid Credential')
    }
})

//@desc Get User Data
//@route GET /api/users/me
//@access Private
const getMe = asyncHandler( async (req,res) => {
    res.json({message: 'User Data Display'})
})

//@desc Get usernames
//@route GET /api/usernames
//@access Public
const getUsernames = asyncHandler(async (req, res) => {
    const usernames = await User.find({username:req.body.username},{_id:0, createdAt:0, updatedAt:0, __v:0})
    res.status(200).json(usernames.length>0);
})

module.exports = {registerUser, loginUser, getMe, getUsernames}