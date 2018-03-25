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

 router.post('/get_rooms_availability', function(req,res,next){
        var db = req.db;
        var collect = db.get('hotels');
        var output =[];
        collect.find({}, function(err, data){
            if(err){res.send({message: "There was a problem" + err.message});}
            else{
                data.forEach(function(out){
                    out.rooms.forEach(function(result){
                        result.push({"type" : result.room_type, "available" : result.rooms_available});
                    });
                });
                res.send(result);
            }
        });
    });

router.get('/otherbookings', function(req,res,next){
	res.render('otherbookings', {title: "Hotel Guide Dashboard"});
});


router.get('/login', function(req,res){
	res.render('login',{title: "Hotel Guide Login"});
});

module.exports = router;