const express = require('express')
const { registerUser,getMe,loginUser,getUsernames } = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

//router.route('/').get(getGoals).post(setGoal);
//router.route('/:id').put(updateGoal).delete(deleteGoal);

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.get('/me', protect, getMe);
router.post('/usernames', getUsernames);


module.exports = router