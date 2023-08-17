const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')


// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async(req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success:true,
            count: query.length,
            data:query
        })
    } else {
        return res.status(200).json(res.advancedResults)
    }

    // const courses = await query

    // res.status(200).json({
    //     success: true,
    //     count: courses.length,
    //     data:courses
    // })
})

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`),404)
    }
    
    res.status(200).json({
        success: true,
        data:course
    })
})

// @desc Add course
// @route POST /api/v1/bootcamps/:BootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async(req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`),404)
    }   

    // Make sure the user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to this bootcamp`,401))
    }

    const course = await Course.create(req.body)

    if(!course) {
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`),404)
    }
    
    res.status(200).json({
        success: true,
        data:course
    })
})

// @desc Update course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async(req,res,next)=>{
    let course = await Course.findById(req.params.id)

    if(!course) {
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`),404)
    }

    // Make sure the user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`,401))
    }

    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data:course
    })
})

// @desc Delete course
// @route PUT /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findOne({ _id: req.params.id }).populate('bootcamp');
    const query = await Course.find({bootcamp: course.bootcamp._id});
    console.log(query.length)
    console.log(course.bootcamp._id)
    // const course = await Course.findOneAndDelete({ _id: req.params.id })
    if (!course) {
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404);
    }

       // Make sure the user is bootcamp owner
       if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`,401))
    }
    
    await course.deleteOne(); // Use the deleteOne() method
    let averageCost;
    try {
        const bootcamp = await Bootcamp.findById(course.bootcamp._id);
        averageCost = query.length!=1 ?  (bootcamp.averageCost*query.length-course.tuition)/(query.length-1) : 0
        console.log(averageCost)
    } catch (err) {
    console.log(err);
    }

    try {
        await Bootcamp.findByIdAndUpdate(course.bootcamp._id, {
            averageCost,
        });
    } catch (err) {
    console.log(err);
    }
        
    res.status(200).json({
        success: true,
        data:{}
    })
})