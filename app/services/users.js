var mysql = require('mysql');
var configuration = {
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'mean_sample',
	port: 3306
};

exports.getAllUser = (next) => {
	var strSQL = mysql.format('SELECT U.*, MD5(U.user_id) as _id FROM users U;');
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, rows){
		if (err) {
			return next(err, null);
		}
		return next(null, rows);
	});
	connection.end();
};

exports.createUser = (user, next) => {
	var strSQL = mysql.format('INSERT INTO users(firstname, lastname, username, password) VALUES(?,?,?,?)', [
			user.firstname, user.lastname, user.username, user.password
	]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result.insertId);
	});
	connection.end();
};

exports.checkUsernameDuplicate = (username, next) => {
	var strSQL = mysql.format('SELECT * FROM users WHERE username = ?', [username]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result);
	});
	connection.end();
};

exports.checkUsernameDuplicate2 = (_id, username, next) => {
	var strSQL = mysql.format('SELECT * FROM users WHERE username = ? AND MD5(user_id) <> ?', [username, _id]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result);
	});
	connection.end();
}

exports.getUser = (user_id, next) => {
	var strSQL = mysql.format('SELECT * FROM users WHERE MD5(user_id)=? LIMIT 1', [user_id]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result);
	});
	connection.end();	
};

exports.deleteUser = (user_id, next) => {
	var strSQL = mysql.format('DELETE FROM users WHERE MD5(user_id)=?', [user_id]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result.affectedRows);
	});
	connection.end();	
}

exports.updateUser = (user_id, user, next) => {
	var strSQL = mysql.format('UPDATE users SET firstname=?, lastname=?, username=?, password=? WHERE MD5(user_id)=? LIMIT 1', [
		user.firstname, user.lastname, user.username, user.password, user_id
	]);
	var connection = mysql.createConnection(configuration);
	connection.query(strSQL, function(err, result) {
		if (err) {
			return next(err, null);
		}
		return next(null, result.affectedRows);
	});
	connection.end();	
}