var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HotelGuide Bot'});
});



/* POST to Add User Service */
router.post('/addcustomer', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var collection = db.get('usercollection');
        var booking_data ={
        fullname :  req.body.fullname,
        email : req.body.email,
        phonenumber : req.body.phonenumber,
        checkin_date : req.body.checkin_date,
        checkout_date : req.body.checkout_date,
        pay : req.body.pay,
        current_date : req.body.current_date,
        room_type    : req.body.rooms,
        total_amount : req.body.amount,
      };

collection.insert(booking_data, function(err, customers){
          if(err){
            res.send('error'+ err.message);
            console.log(err.message);
          }
          else {
            res.send("success");
          }
      });

});

module.exports = router;
