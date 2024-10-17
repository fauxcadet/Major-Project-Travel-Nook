const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js")

const listingSchema =new Schema ({
    title:{
        
        type:String,
        required: true
    } ,
    description: String,
    image: {
        type:String,
        //default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Ffree%2520non%2520copyrighted%2F&psig=AOvVaw2cOo-LFcNc_eCGaMTf-Vpk&ust=1723122727014000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJDir8L64ocDFQAAAAAdAAAAABAE",
        set :(v)=>v ===""? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Ffree%2520non%2520copyrighted%2F&psig=AOvVaw2cOo-LFcNc_eCGaMTf-Vpk&ust=1723122727014000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJDir8L64ocDFQAAAAAdAAAAABAE"
        : v,
    },
    price: Number,
    location: String,
    country: String,

    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        
    }
});
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){

        await Review.deleteMany({_id: {$in: listing.reviews}})
    }

})

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;