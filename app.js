const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");
const userrouter= require("./routes/user.js");
const { date } = require("joi");


const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("conected to Data base")
})
    .catch((err) => {
        console.log(err);
    })

// for data base we write a new async function
async function main() {
    await mongoose.connect(mongo_url)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));// for extracting id from the url
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
    
};
app.get("/", (req, res) => {
    res.send("Hi, I am sourav");
});

//middleware sessions
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.success= req.flash("success") ;
   res.locals.error= req.flash("error") ;
   res.locals.currUser =req.user;
   next();
})

//Create route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {


//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings",Listing);

// })
// );

// app.get("/demoouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"chouhansourav4@gmail.com",
//         username:"sourav"
//     })
//     let registededUser = await User.register(fakeUser,"helloworld");
//    res.send(registededUser);
// })

app.use("/listings",listings)

app.use("/listings/:id/reviews",reviews);
app.use("/",userrouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})
app.listen(5050, () => {
    console.log("server is running succesfully")
});