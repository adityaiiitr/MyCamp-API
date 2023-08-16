const User = require('../models/Users')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler( async (req,res,next) => {
    const {name, email, password, role} = req.body;

    // Create a User
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // Create a token 
    const token = user.getSignedJwtToken()

    res.status(200).json({success:true, token})

})

// @desc LogIn User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler( async (req,res,next) => {
    const {email, password} = req.body;

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse(`Please provide email and password`,400))
    }

    // Check for user
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse(`Invalid Credentials`,401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if(!isMatch) {
        return next(new ErrorResponse(`Invalid Credentials`,401))    
    }

    // Create a token 
    const token = user.getSignedJwtToken()

    res.status(200).json({success:true, token})

})