var express = require('express');
var router = express.Router();

router.get('/', function(req, res,next){

	var db = req.db;
    var collection = db.get('usercollection');
    var userlist =[];
    collection.find({},{}, function(err, data){
    
	if (err) {
		res.send({message: "There was a problem adding the information to the database. " + err.message});
	}
	else{
		// console.log(data);

		// res.render("dashboard",{"data" : data});
    for(var i = 0; i < data.length; i++) 
  {
    userlist.push({fullname: data[i].fullname, email: data[i].email, phonenumber: data[i].phonenumber,roomt:data[i].room_type});
  }

  console.log(userlist);
  // console.log(peopleList[0].name + ' ' + peopleList[0].wage + ' ' + peopleList[0].role);

  res.render('dashboard', {userlist: userlist});
}

    // });
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

module.exports = router;var express = require('express');
var router = express.Router();

router.get('/', function(req, res,next){

    var db = req.db;
    var collection = db.get('usercollection');
    var userlist =[];
    collection.find({},{}, function(err, data){
    
    if (err) {
        res.send({message: "There was a problem adding the information to the database. " + err.message});
    }
    else{
        // console.log(data);

        // res.render("dashboard",{"data" : data});
    for(var i = 0; i < data.length; i++) 
  {
    userlist.push({fullname: data[i].fullname, email: data[i].email, phonenumber: data[i].phonenumber,roomt:data[i].room_type});
  }

  console.log(userlist);
  // console.log(peopleList[0].name + ' ' + peopleList[0].wage + ' ' + peopleList[0].role);

  res.render('dashboard', {userlist: userlist});
}

    // });
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