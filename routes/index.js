var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HotelGuide Booking'});
});

/* GET contents */
router.get('/reply', function(req, res, next){
  // res.render('reply', {title: "Results Page"});
  var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('reply', {
            "collection" : docs
        });
    });
});

/* Testing mailer-> Sending an email */
function sendEmail(id,subject,body,template,res){
    res.mailer.render(template, {
          to: id, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
          subject: subject, // REQUIRED. 
          body: body,
          otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
          }, function (err) {
          if (err) {
              res.send('Error'+err) ;
          }
          return;
          }
      );    
  }

/* POST to Add User Service */
router.post('/addcustomer', function(req, res, next) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var fullname = req.body.fullname;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var checkin_date = req.body.checkin_date;
    var checkout_date = req.body.checkout_date;
    var pay = req.body.pay;
    var current_date = req.body.current_date;

    // Set our collection
    var collection = db.get('usercollection');

    collection.find({check_in: checkin_date}, function(err, obj, header){
      if(err) res.send("There was an error");
      if(obj.length >= 1) {
        // res.redirect("index",{title: 'Home'})
        res.send("Sorry, we are already booked for that date ....")
        
      } else {
            // Submit to the DB
      collection.insert({
          "fullname" : fullname,
          "email" : email,
          "phonenumber": phonenumber,
          "check_in": checkin_date,
          "check_out" : checkout_date,
          "payment method" : pay,
          "booking_date": current_date
      }, function (err, doc) {
          if (err) {
              // If it failed, return error
              res.send("There was a problem adding the information to the database. "+ err.message);
          }
          else {
              // And forward to success page
              sendEmail(email+',kgidion1@hivetechug.com,obia@hivetechug.com',
                'Password reset','Your Password is set to xxxxx. Please log in back.','email',res);
              // res.redirect('email',{title: "Email Success"});
                data = {'message': 'Booking successful !'}
              return res.send(data.message);
          }
      });
    }
    })
    
});

module.exports = router;
