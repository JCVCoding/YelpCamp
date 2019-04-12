var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

// CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req, res){
    // get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var cost = req.body.cost;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, cost: cost, description: desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampGround, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           // redirect back to campgrounds page
    res.redirect("/campgrounds");
       }
    });
});


// New Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error","Campground not found!");
           res.redirect("back");
       } else {
            // render the show template with that campground
            res.render("campgrounds/show", {campground: foundCampground}); 
       }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground){
         req.flash("success","Campground succesfully edited!");
         res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    var newData = {name: req.body.name, image: req.body.image, cost: req.body.cost, description: req.body.description};
//   find and update correct campground
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           // redirect 
           res.redirect("/campgrounds/" +req.params.id);
       }
    });
});


// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findOneAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Campground succesfully deleted!");
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;