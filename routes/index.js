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
    var booking_data = {
        fullname :  req.body.fullname,
        email : req.body.email,
        phonenumber : req.body.phonenumber
   };
    booking_data.hotel = [{
        hotelname: "Serena Hotel",
        room_type: req.body.rooms,
        amount: req.body.amount,
        checkin_date: req.body.checkin_date,
        checkout_date: req.body.checkout_date
    }];

  db.collection('hotels').find({rooms:{ $elemMatch: {room_type: req.body.rooms, rooms_available: {$lt: 1} } }}, function(err, obj){
    if(err) res.send("There was an error");
    if(obj.length >= 1) {
      res.send({message:"Sorry, the rooms of that Type are all booked",err: true});
      // console.log(obj)
    }
    else {
        var id='';
        db.collection("hotels").find({rooms:{$elemMatch: {room_type: req.body.rooms}}},function (err, doc) {
            doc.forEach(function (result) {
                console.log(result._id);
                id = result._id;
                db.collection("hotels").update(
                    {_id: result._id, "rooms.room_type": req.body.rooms},
                    { $inc: {"rooms.$.rooms_available": -1} }
                );
            });
        });

        // _id -> this is for the document in which the hotel(s) are contained
        // db.collection("hotels").update(
        //     {_id: id, "rooms.room_type": req.body.rooms},
        //     { $inc: {"rooms.$.rooms_available": -1} }
        // );

      collection.insert(booking_data, function(err, customers){
          if(err){
            res.send({message:"There was a problem adding the information to the database. "+ err.message});
            // console.log(err.message);
          }
          else {
              // console.log(customers);
              data = {'message': 'Booking successful !'};
              return res.send(data.message);

            var transporter = nodemailer.createTransport({
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
                    html: mailoutput
               });
          }
      });
    }
  });
});

module.exports = router;
