const ErrorResponse = require('../utils/errorResponse')
// Custom Error Middleware
const errorHandler = (err,req,res,next) =>{
    let error = {...err}

    error.message = err.message
    // Log to console for dev
    console.log(err.red)

    // Mongoose Bad ObjectId
    if(err.name==='CastError') {
        const message = `Bootcamp Not Found with id of ${err.value}`
        error = new ErrorResponse(message,404)
    }

    // Mongoose Duplicate key
    if(err.code===11000){
        const message = 'Duplicate Field Value Entered'
        error = new ErrorResponse(message,400)
    }

    // Mongoose Validation Error
    if(err.name==='ValidationError') {
        const message = Object.values(err.errors).map(val => " "+val.message)
        error = new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler