var express = require('express');
var router = express.Router();

router.get('/', function(req, res,next){

	res.render('dashboard', {title: "Hotel Guide Dashboard"});

});

router.get('/rooms', function(req,res,next){
	res.render('rooms', {title: "Hotel Guide Dashboard"});
});

router.get('/admin_login', function(req,res){
	res.render('login',{title: "Hotel Guide Login"});
});

module.exports = router;