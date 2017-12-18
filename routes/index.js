var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

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

      var condition = {
        'checkin_date': {$lte: req.body.checkin_date},
        'checkout_date': {$gt: req.body.checkin_date}
      };
      collection.find(condition, function(err, obj){
        if(err) res.send("There was an error");
        if(obj.length >= 1) {
          res.send({message:"Sorry, we are already booked for that date",err: true, obj});          
        } 
        else 
        {
          collection.insert(booking_data, function(err, customers){
          if(err){
            res.send('error'+ err.message);
            console.log(err.message);
          }
          else {
            let transporter = nodemailer.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            });
             var mailoutput = "<html><body>"+
                  "<p>Hello Sheraton Hotel, you have a booking from "+
                  req.body.fullname+". Find full details below; </p><br>"+
                  "<b>Fullname:</b> "+req.body.fullname+ "<br>"+
                  "<b>Email</b>: "+req.body.email+ "<br>"+
                  "<b>Phonenumber</b>: "+req.body.phonenumber+ "<br>"+
                  "<b>Room Type</b>: "+req.body.rooms+ "<br>"+
                  "<b>Total Amount</b>: "+req.body.amount+ "<br>"+
                  "<b>Check-in Date</b>: "+req.body.checkin_date+ "<br>"+
                  "<b>Check-out Date</b>: "+req.body.checkout_date+ "<br>"+
                  "<b>Payment Method</b>: "+req.body.pay+ "<br>"+
                  "<p>You can confirm this booking by calling the customer "+
                  "or sending them an email. "+
                  "Thank you for using Hotel Guide as your booking agent. </p>"+
                  "</body></html>";

                   transporter.sendMail({
                        from: 'obia@hivetechug.com',
                        to: 'rowlandsemmy@gmail.com',
                        cc: 'obia.williams@gmail.com',
                        bcc: 'kgidion1@gmail.com',
                        subject: 'Hotel Booking',
                        html: mailoutput,
                   }, 
              // nodemailer.sendMail({
              //     from: 'booking@hotelguide.com',
              //     to: 'rowlandsemmy@gmail.com',
              //     cc: 'obia.williams@gmail.com',
              //     bcc: 'kgidion1@gmail.com',
              //     subject: 'Hotel Booking',
              //     html: mailoutput
              // }
              (err, info) => {
                  console.log(info);
              });
          }
      });
        }        
      });   
});

module.exports = router;
