const express = require('express');
const dotenv = require('dotenv')

const logger = require('./middleware/logger') 
const morgan = require('morgan')
const colors = require('colors')

const connectDB = require('./config/db')

const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({path:'./config/config.env'})

// Connect  to database
connectDB()

// routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')


const app = express();

//Body Parser
app.use(express.json())

// Dev Logging Middlewares 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// app.use(logger)


// Mount routers
app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)

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