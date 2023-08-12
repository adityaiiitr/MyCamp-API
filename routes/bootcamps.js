const express = require('express');

const {
     getBootcamps,
     getBootcamp, 
     createBootcamp, 
     updateBootcamp, 
     deleteBootcamp,
     getBootcampsInRadius,
     bootcampPhotoUpload
} = require('../controllers/bootcamps')

const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')

// Include other resource router
const courseRouter = require('./courses')

const router = express.Router()

// Reroute into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/:radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(bootcampPhotoUpload)

router
     .route('/')
     .get(advancedResults(Bootcamp,'courses'), getBootcamps)
     .post(createBootcamp)

router
     .route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp)

module.exports = router