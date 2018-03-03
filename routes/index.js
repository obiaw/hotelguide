var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET hotels */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET hotel rooms */
router.post('/get_hotel_rooms', function (req, res, next) {
    var db = req.db;
    var collection = db.get('hotels');
    var hotel_name = req.body.hotel;
    var results = [];
    if (hotel_name === 'Choose Hotel'){
        results = [];
        res.send(results);
    }else{
        collection.find({hotelname: hotel_name}, function (err, docs) {
            docs.forEach(function (values) {
                values.rooms.forEach(function (result) {
                    results.push({"room":result.room_type,"price":result.price});
                });
            });
            res.send(results);
        });
    }
});

/* GET chosen room's price */
router.post('/get_room_price', function (req, res, next) {
    var db = req.db;
    var collection = db.get('hotels');
    var hotel_name = req.body.hotel;
    var room = req.body.room;
    var results = [];
    var room_price = 0;
    if (hotel_name === 'Choose Hotel'){
        results = [];
        res.send(results);
    }else{
        collection.find({hotelname: hotel_name}, function (err, docs) {
            docs.forEach(function (values) {
                values.rooms.forEach(function (result) {
                    if(result.room_type === room) {
                        results.push(result.price);
                    }
                });
            });
            res.send(results);
        });
    }
});

function get_room(hotel, hotel_object) {
    var our_rooms = [];
    hotel_object.forEach(function (values) {
        if(values.hotelname === hotel){
            values.rooms.forEach(function (result) {
                our_rooms.push(result.price);
            });
        }
    });
    return our_rooms;
}

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

    var collection = db.get('usercollection');

    /** updating number of available rooms for a particular room type in a particular Hotel **/
    collection.find({"hotel.checkout_date": req.body.current_date}, function (err, docs) {
       if(docs.length >= 1){
           var hotel_name, room_type;
           docs.forEach(function (result) {
               result.hotel.forEach(function (items) {
                   hotel_name = items.hotelname;
                   room_type = items.room_type;
                   db.collection('hotels').find({hotelname: hotel_name, "rooms.room_type": room_type}, function (err, doc) {
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
        phonenumber : req.body.phonenumber,
        status: req.body.status
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
    }
    else {
        db.collection("hotels").find({"rooms.room_type": req.body.rooms},function (err, doc) {
            doc.forEach(function (result) {
                db.collection("hotels").update(
                    {_id: result._id, "rooms.room_type": req.body.rooms},
                    { $inc: {"rooms.$.rooms_available": -1} }
                );
            });
        });

      collection.insert(booking_data, function(err, customers){
          if(err){
            res.send({message:"There was a problem adding the information to the database. "+ err.message});
          }
          else {
              sendEmail(req,res);
              data = {'message': 'Booking successful!'};
              return res.send(data.message);
          }
      });
    }
  });
});

module.exports = router;
