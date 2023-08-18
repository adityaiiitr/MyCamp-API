const express = require('express');
const dotenv = require('dotenv')
const fileupload = require('express-fileupload')
const logger = require('./middleware/logger') 
const morgan = require('morgan')
const colors = require('colors')

const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db')

const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({path:'./config/config.env'})

// Connect  to database
connectDB()

// routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')


const app = express();

//Body Parser
app.use(express.json())

// Dev Logging Middlewares 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// app.use(logger)

// File upload
app.use(fileupload())

// By default, $ and . characters are removed completely from user-supplied input in the following places: to replace these prohibited characters with _, use:
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

// Set static folder
const path = require('path')
app.use(express.static(path.join(__dirname,'public')))

// Mount routers
app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`.red)
    // close sever and exit process
    server.close(()=>{
        process.exit(1)
    })
})