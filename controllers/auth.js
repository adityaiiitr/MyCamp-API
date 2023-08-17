const User = require('../models/Users')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const { application } = require('express')

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

    sendTokenResponse(user,200,res)

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


    sendTokenResponse(user,200,res)

})

// @desc Get current logged in User
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler( async (req,res,next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data:user
    })
})

// @desc Forgot Password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler( async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})

    if(!user) {
        return next(new ErrorResponse(`There is no user with that email`,404))
    }

    // get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave:false})

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requsted the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`

    try {
        await sendEmail({
            email:user.email,
            subject:'Password reset token',
            message
        })
        res.status(200).json({
            success: true,
            data:'Email Sent!'
        })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave:false
        })
        return next(new ErrorResponse(`Email could not be send.`,404))
    }

    
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  };
  