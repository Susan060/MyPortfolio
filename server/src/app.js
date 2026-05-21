require("./config/cloudinary.js");
const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const authRoutes=require('./routes/auth.routes')
const contactRoutes=require('./routes/contact.routes')
const uploadRoutes = require("./routes/upload.routes");
const caseStudyRoutes=require('./routes/casestudy.routes.js')
const categoryRoutes=require('./routes/category.routes.js')
const tagRoutes=require('./routes/tag.routes.js')

const app=express()

const allowedOrigins = [
  'http://localhost:3000', 
  'https://susan-adhikari.com.np/',
  'https://www.prabeshghimire.com',
  // Add any other domains you need
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, X-Requested-With, x-user-id");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400"); // Cache preflight for 24 hours
    return res.sendStatus(204);
  }

  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())

//api
app.use('/api/auth',authRoutes)
//contact
app.use('/api/contact',contactRoutes)
//cloudinary
app.use("/api/upload", uploadRoutes);

app.use('/api/categories',categoryRoutes)
app.use('/api/tags',tagRoutes)

//CaseStudies
app.use('/api/case-studies',caseStudyRoutes)

module.exports=app 