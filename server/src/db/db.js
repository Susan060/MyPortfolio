const mongoose=require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected Successsfully")
        
    } catch (error) {
        console.error("Datbase Error",error)
    }


}
module.exports=connectDB;