const express = require('express');

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')

const advancedResults = require('../middleware/advancedResults')
const Courses = require('../models/Course')

const router = express.Router({mergeParams:true})

const { protect } = require('../middleware/auth')

router
    .route('/')
    .get(advancedResults(Courses,{
        path: 'bootcamp',
        select: 'name description'
        }),
        getCourses)
    .post(protect, addCourse)
    
router
    .route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse)


module.exports = router