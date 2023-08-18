const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/Users')

// Protect routes
exports.protect = asyncHandler(async(req,res,next) => {
    let token;
    // sset token from bearer token in header
    if(req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } 
    // // set token from cookie
    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }

    // make sure token exist 
    if(!token) {
        return next(new ErrorResponse(`Not authorize to access the route!`,401))
    }

    try {
        // verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECERET)
        console.log(decoded)
        req.user = await User.findById(decoded.id)
        
        next();

    } catch (err) {
        return next(new ErrorResponse(`Not authorize to access the route!`,401))
    }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorised to access this route`,403))
        }
        next()
    }
}