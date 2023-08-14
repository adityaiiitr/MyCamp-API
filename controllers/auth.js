const User = require('../models/Users')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler( async (req,res,next) => {
    res.status(200).json({success:true})
})