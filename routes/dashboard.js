var express = require('express');
var router = express.Router();

router.get('/', function(req, res,next){

	var db = req.db;
    var collection = db.get('usercollection');
    var result = {};
    var arr = [];
    collection.find({}, function(err, data){
    
	if (err) {
		res.send({message: "There was a problem adding the information to the database. " + err.message});
	}
	else{

		// console.log(data);
        // data.forEach(function(docs){
        //     console.log(output);
        //     output.hotel.forEach(function(h){
        //         console.log(h);
        //     });
        //     result= Object.assign({},docs);
        //     arr.push(result);
           
        // });

        // console.log(result);
		res.render("dashboard",{"data" : data});
	}

    });
});

 router.get('/get_rooms_availability', function(req,res,next){
        var db = req.db;
        var collect = db.get('hotels');
        var output =[];
        collect.find({}, function(err, data){
            if(err){res.send({message: "There was a problem" + err.message});}
            else{
                data.forEach(function(out){
                    out.rooms.forEach(function(result){
                        output.push({"type" : result.room_type, "available" : result.rooms_available});
                    });
                });
                res.send(output);
            }
        });
    });


router.get('/otherbookings', function(req,res,next){
    var db = req.db;
    var collection = db.get('hotels');
    var roomz = [];
    collection.find({},function(err,data){
        if(err){res.send({message: "There was a problem" + err.message});}
        else{
            data.forEach(function(outcome){
                // console.log(outcome);
                outcome.rooms.forEach(function(result){
                roomz.push({"room_t" : result.room_type});
                // console.log(result);
                });
            });
            // console.log(roomz);
            res.render('otherbookings', {"roomz" : roomz});
        }
        // console.log(roomz);
        // res.render('otherbookings', {"roomz" : roomz});
    });
    // console.log(roomz);

});

router.post('/other_booking',function(req,res,next){
    var db = req.db;
    var collection = db.get('booking_source');
    var hotels_collection = db.get('hotels');
    var form_data ={
        source : req.body.source,
        room_type : req.body.room_typ,
    };
    var hotel = "Serena Hotel";
    console.log(req.body);
    hotels_collection.find({hotelname: hotel, "rooms.room_type" : req.body.room_ty}, function(err, result){
        result.forEach(function(docs){
            hotels_collection.update({_id: docs._id,"rooms.room_type": req.body.room_ty},{$inc: {"rooms.$.rooms_available": -1}});
        });
    });
    collection.insert(form_data,function(err,data){
        if(err){res.send({message: "There was a problem" + err.message});}
        else{
            collection.find({}, function(err,data){
            if(err){res.send({message: "There was a problem" + err.message});}
            else{
                 res.send({message: "Success!", data: data}); 
            }
            });
          
        }
    });
    // console.log(req.body);

});

router.get('/get_others',function(req,res,next){
    var db = req.db;
    var collect = db.get('booking_source');
    collect.find({}, function(err,data){
            if(err){res.send({message: "There was a problem" + err.message});}
            else{
                 res.send({data: data}); 
            }
    });

});

router.get('/login', function(req,res){
	res.render('login',{title: "Hotel Guide Login"});
});

router.get('/register', function(req,res){

    res.render('register');
});
module.exports = router;