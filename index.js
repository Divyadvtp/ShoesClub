//import the modules
const express = require('express');
const path = require('path');

//set up express validator
const {check, validationResult} = require('express-validator'); // ES6 destructuring object
const e = require('express');

//set up mongoose
const mongoose = require('mongoose');


//create express app
var myApp = express();

//connection to mongoDB
mongoose.connect('mongodb://localhost:27017/ShoesClub');


//middlewares and other setup
//use() define middlewares, express.static() os built in middleware function in express
//Middleware functions access the HTTP request and response objects. They either terminate the HTTP request or forward it for further processing to another middleware function.
//main static public path set
myApp.use(express.static(__dirname + '/public'));

//create a model 
const FormData = mongoose.model('FormData', {

        name: String,
        email: String,
        phone: Number,
        address: String,
        city: String,
        province: String,
        sneakers: Number,
        running: Number,
        ankleBoot: Number,
        hikingBoot: Number,
        sneakerCost: Number,
        runningCost: Number,
        ankleCost: Number,
        hikingCost: Number,
        snkeakerSubtotal: Number,
        runningSubtotal: Number,
        ankleSubtotal: Number,
        hikingSubtotal: Number,
        stateTax: String,
        subTotal: Number,
        gst: Number,
        total: Number
})

//define view engine and views
//below set the view engine as a ejs.
myApp.set('view engine', 'ejs');

//myApp.set('views', './views');
//below define the path for views files
myApp.set('views', path.join(__dirname, 'views'));

//set up body parser
myApp.use(express.urlencoded({extended:false}));

//routes
//form page, when side load initial page that will be loaded
myApp.get('/',function(req, res){

    res.render('form'); //render form.ejs file from the views folder
    
});

//all orders page
myApp.get('/orders',function(req, res){
    //find({}) empty object will find everything/all the data. 
    FormData.find({}).exec(function(err, orderdatas) {
        var pageData = {
            orderdatas:orderdatas
        }
        //res.render('orders', {carddatalist:carddatalist}); // will render list.ejs either way we can write
        res.render('orders', pageData); //render orders.ejs 
    });
    
});

//view unique card
myApp.get('/view/:id', function (req, res){
    //var name defined in the URL after the colon must be the the same we give in req.params.id
    // to get the value that is received in the URL (:id)
    // passed below id in the href while creating the link in orders.ejs
    var id = req.params.id;

    //fetch the record where id is equal to the id in URL
    //findByID() is old to use because compiler will give warning
    FormData.findOne({_id: id}).exec(function(err, uniqueorder){
        
        var pageData = {

            name: uniqueorder.name,
            email: uniqueorder.email,
            phone: uniqueorder.phone,
            address: uniqueorder.address,
            city: uniqueorder.city,
            province: uniqueorder.province,
            sneakers: uniqueorder.sneakers,
            running: uniqueorder.running,
            ankleBoot: uniqueorder.ankleBoot,
            hikingBoot: uniqueorder.hikingBoot,
            sneakerCost: uniqueorder.sneakerCost,
            runningCost: uniqueorder.runningCost,
            ankleCost: uniqueorder.ankleCost,
            hikingCost: uniqueorder.hikingCost,
            snkeakerSubtotal: uniqueorder.snkeakerSubtotal,
            runningSubtotal: uniqueorder.runningSubtotal,
            ankleSubtotal: uniqueorder.ankleSubtotal,
            hikingSubtotal: uniqueorder.hikingSubtotal,
            stateTax: uniqueorder.stateTax,
            subTotal: uniqueorder.subTotal,
            gst: uniqueorder.gst,
            total: uniqueorder.total

        }
        res.render('process', pageData); //render the process page which shows reciept for perticular customer order record when click on view in orders.ejs
    });



});


// this is custom quantity validation function to check quantity value must be greater than zero
function customQuantityValidation(value, {req}) {

    //fetch all the product quantity value
    var sneakers = req.body.sneakers;
    var running = req.body.running;
    var ankleBoot = req.body.ankleBoot;
    var hikingBoot = req.body.hikingBoot;
    
    // if qunatity is null than make quantity value zero for the products
    if(sneakers == '') {
        sneakers = 0;
    }
    
    if(running == '') {
        running = 0;
    }

    if(ankleBoot == '') {
        ankleBoot = 0;
    }

    if(hikingBoot == '') {
        hikingBoot = 0;
    }
    
    //if all the product value will be zero than show error message
    if(sneakers == 0 && running == 0 && ankleBoot == 0 && hikingBoot == 0 ) {

        throw new Error('Please enter Atleast one product quantity');
    }

    // if any of the products value will be less than zero than it will show the error message 
    if(sneakers < 0 || running < 0 || ankleBoot < 0 || hikingBoot < 0 ) {

        throw new Error('Invalid product quantity');
    }


    return true;

}


myApp.post('/process', [
    
    //custom validation function called on one product quantity value 
    check('sneakers').custom(customQuantityValidation),
    
    check('sneakers', 'Sneaker Shoes quantity is invalid!').matches(/^[0-9]*$/),
    check('running', 'Running Shoes quantity is invalid!').matches(/^[0-9]*$/),
    check('ankleBoot', 'Ankle Boot quantity is invalid!').matches(/^[0-9]*$/),
    check('hikingBoot', 'Hiking Boot quantity is invalid!').matches(/^[0-9]*$/),

    //reference for regex: https://stackoverflow.com/questions/55562485/regular-expression-for-any-number-or-null-value
    check('name','Please enter your name').notEmpty(),
    check('email','Please enter your email in correct format').isEmail(),
    check('phone', 'Please enter your phone number in correct format').isMobilePhone(),
    check('address', 'Please enter your address').notEmpty(),
    check('city', 'Please enter name of your city').notEmpty(),
    check('province', 'Select your province').notEmpty()
    

], function(req,res) {
        
    //fetch all the product quantity value
    var sneakers = req.body.sneakers;
    var running = req.body.running;
    var ankleBoot = req.body.ankleBoot;
    var hikingBoot = req.body.hikingBoot;
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var province = req.body.province;

    //using validation method of express-validator
    const errors = validationResult(req);
    
    //checking if there are errors
    if(!errors.isEmpty()) {
        //if there are errors
        var errorData = errors.array();
        
        //send user data to view for preserving it
        var userData = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            province: province,
            sneakers: sneakers,
            running: running,
            ankleBoot: ankleBoot,
            hikingBoot: hikingBoot, 
        }

        //send user data and errors messages to view
        var pageData = {
            errors: errorData,
            userData: userData
        }

        //rendering form page only if there are errors
        res.render('form', pageData);


    }
    else {
        //initializing all the product cost, product total price, subtotal, gst and total
        var sneakerCost = 60;
        var runningCost = 45.99;
        var ankleCost = 30;
        var hikingCost = 84.99;
        var snkeakerSubtotal = 0.0;
        var runningSubtotal = 0.0;
        var ankleSubtotal = 0.0;
        var hikingSubtotal = 0.0;
        var subTotal = 0.0;
        var gst = 0.0;
        var stateTax = 0.0;
        var total = 0.0;

        //process data
        //calculating product subtotal as per quantity given by users
        snkeakerSubtotal = sneakers * sneakerCost;
        runningSubtotal = running * runningCost;
        ankleSubtotal = ankleBoot * ankleCost;
        hikingSubtotal = hikingBoot * hikingCost;

        //calculating overall subtotal 
        subTotal = snkeakerSubtotal + runningSubtotal + ankleSubtotal + hikingSubtotal;
        
        //checking province value to calculate GST in order to charge different state taxes for different province in canada
        if(province == 'AB' || province == 'BC' || province == 'MB' || province == 'NT' || province == 'NU' || province == 'QC' || province == 'SK' || province == 'YT') {

            //gst calculation for state tax 5%
            gst = subTotal * 0.05;
            stateTax = '5%';
        }
       else if(province == 'NB' || province == 'NL' || province == 'NS' || province == 'PE') {
            
            //gst calculation for state tax 15%
            gst = subTotal * 0.15;
            stateTax = '15%';
       }
       else if(province == 'ON') {
        
            //gst calculation for state tax 13%
            gst = subTotal * 0.13;
            stateTax = '13%';

       }

       //calculating total price after by adding gst to subtotal
        total = subTotal + gst;

        //send data to view
        var pageData = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            province: province,
            sneakers: sneakers,
            running: running,
            ankleBoot: ankleBoot,
            hikingBoot: hikingBoot,
            sneakerCost: sneakerCost,
            runningCost: runningCost,
            ankleCost: ankleCost,
            hikingCost: hikingCost,
            snkeakerSubtotal: snkeakerSubtotal,
            runningSubtotal: runningSubtotal,
            ankleSubtotal: ankleSubtotal,
            hikingSubtotal: hikingSubtotal,
            stateTax: stateTax,
            subTotal: subTotal,
            gst: gst,
            total: total
        }

        //create object for model
        var newFormData = new FormData(pageData);

        //save all the pageData to the mongoDb database
        newFormData.save();

        //render process.ejs page to view with page data that generate receipt
        res.render('process', pageData);
    }


});



//listen at a port 
// myApp.listen(8080, () => {console.log('Open http://localhost/8080')});
myApp.listen(8080);
console.log('Open http://localhost:8080 in your browser');  