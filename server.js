const express=require('express');
const mongoose = require('mongoose')
const Route = require('./router/homeRouter.js')
const dotenv=require('dotenv');
dotenv.config();

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.set('view engine', 'ejs')

mongoose
.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Database connected");
})
.catch((e)=>{
    console.log(e.message);
});

app.use('',Route);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port:${process.env.PORT}`);
})