// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req,res,next) =>{
    res.status(200).json({success:true,msg:'Show all Bootcamps'})
}


// @desc Get Single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`Get  Bootcamps ${req.params.id}`})
}

// @desc Create bootcamp
// @route POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:'Create New Bootcamps'})
}

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`Update  Bootcamps ${req.params.id}`})
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`Delete  Bootcamps ${req.params.id}`})
}