/*
1. require
2. define
3. use
4. set
*/

var express = require('express'); //for routes
var app = express(); //initialize the api as 'app'
var bodyParser = require('body-parser'); //to read html headers/requests
var expressValidator = require('express-validator'); //request validators
var async = require('async'); //step-by-step or parallel request 
var fs = require('fs'); //filesystem (already built-in in node.js)
var mysql = require('mysql'); //mysql connector for node.js
/* ----------------- create connection ----------------- */
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'mean_sample'
});
//inject all functions from services/users.js (model)
var users = require('./app/services/users.js');
//inject all validation functions from validator/users.js
var userValidator = require('./app/validator/users.js');

//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());

//swagger.io documentation
app.use('/docs',express.static(__dirname + '/app/docs'));
app.set('views', 'app/docs/');
app.set('view engine', 'ejs');

var port = process.env.PORT || 8080;

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept, Cache-Control,Auth_Token');
    // next();
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
};

app.use(allowCrossDomain);

var router = express.Router();
var route = express.Router();

route.get('/docs', function(req, res){
	res.render('index');
});

route.get('/docs.json', function(req, res){
	var file = 'app/docs/docs.json';
	fs.readFile(file,'utf8', function(err,data){
		if(err){
			console.log('ERROR: ' + err);
			return;
		}
		data = JSON.parse(data);
		res.send(data);
	});
});

router.get('/', function(req,res){
	res.json({message:'Welcome to my API!'});
});

router.route('/users')
	.post(userValidator.validateUser, function(req, res) {
		async.waterfall([
			(callback) => {
				users.checkUsernameDuplicate(req.body.username, (err, response) => {
					if (err) {
						res.send({
							success: false,
							msg: err,
							result: err
						});
					}
					if (response && response.length > 0){
						res.json({
							success: false,
							msg: 'Username already existed',
							result: null
						});
						return;
					} else {
						callback();
					}
				});
			}, (callback) => {
				users.createUser(req.body, function(err, response){
					res.json({
						success: true,
						msg: 'Record successfully saved',
						result: response
					});
				});
			}
		]);
	})
	.get(function(req, res){
		users.getAllUser(function(err, response){
			if (err) {
				res.send({
					success: false,
					msg: err,
					result: err
				});
			}
			res.json({
				success: true,
				message: '',
				result: response
			});
		});
	});
router.route('/users/:user_id')
	.get(function(req, res) {
		users.getUser(req.params.user_id, function(err, response){
			if (err) {
				res.send({
					success: false,
					msg: err,
					result: err
				});
			}
			if (response && response.length > 0){
				response = response[0];
			}
			res.json({
				success: true,
				message: '',
				result: response
			});			
		});
	})
	.put(userValidator.validateUser, function(req, res){
		async.waterfall([
			(callback) => {
				users.checkUsernameDuplicate2(req.params.user_id, req.body.username, (err, response) => {
					if (err) {
						res.send({
							success: false,
							msg: err,
							result: err
						});
					}
					if (response && response.length > 0){
						res.json({
							success: false,
							msg: 'Username already existed',
							result: null
						});
						return;
					} else {
						callback();
					}
				});
			}, (callback) => {
				users.updateUser(req.params.user_id,req.body,function(err, response){
					if (err) {
						res.send({
							success: false,
							msg: err,
							result: err
						});
					}
					res.json({
						success: true,
						msg: 'Record successfully updated',
						result: response
					});
				});
			}
		]);		
	})
	.delete(function(req,res){
		users.deleteUser(req.params.user_id,function(err, response){
			if (err) {
				res.send({
					success: false,
					msg: err,
					result: err
				});
			}
			res.json({
				success: true,
				msg: 'User succesfully deleted',
				result: response
			});
		});
	});


app.use('/api', router);
app.use(route);

connection.connect(function(err){
	if (err){
		console.error('error connecting: '+ err.stack);
		return
	}
	app.listen(port);
	console.log('Running like a black dude on port ' + port);
	console.log('connected as id ' + connection.threadId);
});