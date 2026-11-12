let mongoose=require('mongoose');
require('dotenv').config();




exports.dbConnection=()=>{
    let dbUrl=process.env.DBURL;
mongoose.connect(dbUrl)
.then(()=>{console.log("Atlas Database is connected")})
.catch((e)=>{console.log("Atlas Database is not connected",e)})
}