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

