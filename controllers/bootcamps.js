const Bootcamp = require('../models/bootcamp')
const ErrorResponse = require('../utils/errorResponse')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req,res,next) =>{
    try{
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success:true,count:bootcamps.length,data: bootcamps})
    } catch(err){
        res.status(400).json({success:false})
    }
}


// @desc Get Single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            //for correctly formatted id not in db
            return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
        }
        res.status(200).json({success:true,data: bootcamp})
    } catch(err){
        // res.status(400).json({success:false})
        // next(err) //custom express error handler
        next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`,404 ))
    }
}

// @desc Create bootcamp
// @route POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = async (req,res,next) =>{
    // console.log(req.body)
    try{
        const bootcamp = await Bootcamp.create(req.body)
        res.status(200).json({success:true,data:bootcamp})
    }catch(err) {
        res.status(400).json({success:false})
    }
    
}

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body,{
            new:true,
            runValidator:true
        })
        if(!bootcamp){
            //for correctly formatted id not in db
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:bootcamp})
    }catch(err) {
        res.status(400).json({success:false})
    }
    res.status(200).json({success:true,msg:`Update  Bootcamps ${req.params.id}`})
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req,res,next) =>{
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            //for correctly formatted id not in db
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:{}})
    }catch(err) {
        res.status(400).json({success:false})
    }
    res.status(200).json({success:true,msg:`Update  Bootcamps ${req.params.id}`})
}