const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const urlCode = new mongoose.Schema( {
    urlCode: 
    {  required: true,
        type:String,
        unique: true, 
        lowercase: true, 
        trim: true}, 
    longUrl: { required: true, 
        type:String,
        trim: true}, 

     shortUrl: {required: true, 
        type:String,
        unique: true} ,
        
    date:{type: String, default: Date.now}
    
})
module.exports = mongoose.model('url', urlCode)