const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler( async (req, res, next) => {
    const {username} = req.headers;
    if(!username){
        res.status(401);
        throw new Error('Not authorized.')
    }
    // if(Date.parse(expirydate) < new Date()){
    //     res.status(401);
    //     throw new Error('Session expired.')
    // }
    req.user = await User.findOne({username});
    next();
})

module.exports = {
    protect
}