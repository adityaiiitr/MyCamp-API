const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
        console.log(req.query)
        let query;
        let queryStr = JSON.stringify(req.query)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)
        console.log(queryStr)
        query = Bootcamp.find(JSON.parse(queryStr));
        const bootcamps = await query
        res.status(200).json({success:true,count:bootcamps.length,data: bootcamps})

})


// @desc Get Single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            //for correctly formatted id not in db
            return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
        }
        res.status(200).json({success:true,data: bootcamp})

})

// @desc Create bootcamp
// @route POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = asyncHandler(async (req,res,next) =>{
    // console.log(req.body)
        const bootcamp = await Bootcamp.create(req.body)
        res.status(200).json({success:true,data:bootcamp})

    
})

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body,{
            new:true,
            runValidator:true
        })
        if(!bootcamp){
            //for correctly formatted id not in db
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:bootcamp})

})

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            //for correctly formatted id not in db
            return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
        }
        res.status(200).json({success:true,data:{}})

})


// @desc Get bootcamps within Radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req,res,next) =>{
    const {zipcode,distance} = req.params

    // get lat/lang from the geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // cal radius using radians
    // Divide distance by radius of earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location:{$geoWithin: {$centerSphere: [[lng,lat],radius]}} 
    })

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data: bootcamps
    })


})