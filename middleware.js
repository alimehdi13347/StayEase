const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");



module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must login int Stay Ease");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.validateListing= (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next()
    }
};


module.exports.validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }
    else{
        next()
    }
};

module.exports.isOwner= async(req,res,next)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You Dont Have Permission");
       res.redirect(`/listings/${id}`)

    }
    next();
}

module.exports.isAuthor= async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error","You are not Author of this review");
       return res.redirect(`/listings/${id}`)
    }
    next();
}
