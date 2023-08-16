const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

const path = require('path')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
        // console.log(req.query)
        // let query;

        // // Copy the req.query
        // const reqQuery = {...req.query}

        // // Fields to exclude
        // const removeFields = ['select','sort','page','limit'];

        // // loop over removeFields and delete them from reqQuery
        // removeFields.forEach(param => delete reqQuery[param])

        // console.log(reqQuery)

        // // Create a query string
        // let queryStr = JSON.stringify(reqQuery)

        // // create a operator ($gt, $gte,etc)
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)

        // // Finding resources
        // query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // // SELECT Fields 
        // if(req.query.select) {
        //     // const fields = req.query.select.split(',').join(' ')
        //     const fields = req.query.select.replace(',',' ')
        //     console.log(fields)
        //     query = query.select(fields)
        // }

        // // Sort
        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt')
        // }

        // // Pagination
        // const page = parseInt(req.query.page, 10) || 1
        // const limit = parseInt(req.query.limit,10) || 25

        // const startIndex = (page -1) * limit
        // const endIndex = page * limit
        // const total = await Bootcamp.countDocuments()
        // query = query.skip(startIndex).limit(limit)
        
        // // Executing Query
        // const bootcamps = await query


        // // Pagination Result
        // const pagination = {}
        // if(endIndex < total) {
        //     pagination.next = {
        //         page:page+1,
        //         limit
        //     }
        // }
        // if(startIndex > 0) {
        //     pagination.next = {
        //         page:page-1,
        //         limit
        //     }
        // }
        // ABOVE CODE MOVED TO MIDDLEWARE ADVANCED RESULTS

        // res.status(200).json({success:true,count:bootcamps.length,pagination,  data: bootcamps})
        res.status(200).json(res.advancedResults)
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

    // Add user to body 
    req.body.user = req.user.id

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user:req.user.id})
     
    // if the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))
    }

        const bootcamp = await Bootcamp.create(req.body)
        res.status(200).json({success:true,data:bootcamp})

    
})

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req,res,next) =>{
        let bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            //for correctly formatted id not in db
            return res.status(400).json({success:false})
        }

        // Make sure the user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,404))
        }

        bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true, // return the updated bootcamp
            runValidator:true
        })

        res.status(200).json({success:true,data:bootcamp})

})

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            //for correctly formatted id not in db
            return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
        }

        // Make sure the user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,404))
        }

        // Trigger the pre-hook middleware to delete associated courses
        await bootcamp.deleteOne();
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

// @desc Upload Photo bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req,res,next) =>{
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        //for correctly formatted id not in db
        return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
    }

    // Make sure the user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,404))
    }
    
    // Trigger the pre-hook middleware to delete associated courses

    if(!req.files) {
        return next(new ErrorResponse(`Please Upload a File`,404 ))   
    }

    console.log(req.files)

    const file = req.files.file
    
    // Make sure the file is photo
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please Upload an Image File`,400 ))         
    }

    // Check Filesize
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please Upload an Image File less than ${process.env.MAX_FILE_UPLOAD}`,400 ))         
    }

    // Create a Custom filename 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`,500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id , {photo: file.name})
    })

    res.status(200).json({success:true,data:file.name})

})