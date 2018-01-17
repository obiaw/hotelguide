var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
   // res.set('X-Frame-Options','https://www.facebook.com/');
  res.render('index', { title: 'HotelGuide Bot'});
});


function sendEmail(req,res){

    let transporter = nodemailer.createTransport({
        sendmail:true,
        newline:'unix',

    });

    transporter.sendMail({
            from: req.body.email,
            to  : 'rowlandsemmy@gmail.com',
            cc  : 'obia.williams@gmail.com',
            bcc :'kgidion1@gmail.com',
            subject: "Hotel Booking",
            html: "<p>Hello there, i would like to make a reservation with your organization. Find full details below; </p><br>"+
            "<b>Fullname:</b> "+req.body.fullname+ "<br>"+
            "<b>Email</b>: "+req.body.email+ "<br>"+
            "<b>Phonenumber</b>: "+req.body.phonenumber+ "<br>"+
            "<b>Room Type</b>: "+req.body.rooms+ "<br>"+
            "<b>Total Amount</b>: "+req.body.amount+ "<br>"+
            "<b>Check-in Date</b>: "+req.body.checkin_date+ "<br>"+
            "<b>Check-out Date</b>: "+req.body.checkout_date+ "<br>"+
            "<b>Payment Method</b>: "+req.body.pay+ "<br>"+
            "Thank you for using Hotel Guide as your booking agent. </p>"},
        (err,info)=>{
        //console.log(info);
        //console.log(err);
});

}


/* POST to Add User Service */
router.post('/addcustomer', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var collection = db.get('usercollection');

    /** updating number of available rooms for a particular room type in a particular Hotel **/
    collection.find({"hotel.checkout_date": req.body.current_date}, function (err, docs) {
       if(docs.length >= 1){
           var hotel_name, room_type;
           docs.forEach(function (result) {
               result.hotel.forEach(function (items) {
                   hotel_name = items.hotelname;
                   room_type = items.room_type;
                   db.collection('hotels').find({hotelname: hotel_name, "rooms.roomtype": room_type}, function (err, doc) {
                       doc.forEach(function (result) {
                           db.collection('hotels').update(
                               {_id: result._id, "rooms.room_type": room_type},
                               {$inc: {"rooms.$.rooms_available": 1}}
                           );
                       });
                   });
               })
           })
       }
    });

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
        checkout_date: req.body.checkout_date,
        booking_date: req.body.current_date
    }];

  db.collection('hotels').find({rooms:{ $elemMatch: {room_type: req.body.rooms, rooms_available: {$lt: 1} } }}, function(err, obj){
    if(err) res.send("There was an error");
    if(obj.length >= 1) {
      res.send({message:"Sorry, the rooms of that Type are all booked",err: true});
      // console.log(obj)
    }
    else {
        db.collection("hotels").find({"rooms.room_type": req.body.rooms},function (err, doc) {
            doc.forEach(function (result) {
                //console.log(result._id);
                db.collection("hotels").update(
                    {_id: result._id, "rooms.room_type": req.body.rooms},
                    { $inc: {"rooms.$.rooms_available": -1} }
                );
            });
        });

      collection.insert(booking_data, function(err, customers){
          if(err){
            res.send({message:"There was a problem adding the information to the database. "+ err.message});
            // console.log(err.message);
          }
          else {
              // console.log(customers);
              sendEmail(req,res);
              data = {'message': 'Booking successful!'};
              // sendEmail(req,res);
              return res.send(data.message);
          }
      });
    }
  });
});

module.exports = router;
