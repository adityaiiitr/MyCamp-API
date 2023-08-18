const express = require('express');

const {
    getUsers, getUser, updateUser, deleteUser, createUser
} = require('../controllers/users')

const advancedResults = require('../middleware/advancedResults')
const User = require('../models/Users')

const router = express.Router({mergeParams:true})

const { protect, authorize } = require('../middleware/auth')

router.use(protect)
// router.use(authorize('admin'))

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;