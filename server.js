const express = require('express');
const dotenv = require('dotenv')

// Load env vars
dotenv.config({path:'./config/config.env'})

const app =express();

app.get('/api/v1/bootcamps',(req,res)=>{
    res.status(200).json({success:true,msg:'Show all Bootcamps'})
})

app.get('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success:true,msg:`Get  Bootcamps ${req.params.id}`})
})

app.post('/api/v1/bootcamps',(req,res)=>{
    res.status(200).json({success:true,msg:'Create New Bootcamps'})
})

app.put('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success:true,msg:`Update  Bootcamps ${req.params.id}`})
})
app.delete('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success:true,msg:`Delete  Bootcamps ${req.params.id}`})
})

const PORT = process.env.PORT || 5000
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))