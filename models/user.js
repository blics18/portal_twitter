var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var saltRounds = 10;
var schema = mongoose.Schema({
		firstName : {type: String},
		lastName : {type: String},
		username: {type: String, unique: true},
		email: {type: String, unique: true},
		password: {type: String},
		following: {type: Array},
		followers: {type: Array}
});

schema.methods.checkPassword = function checkPassword(password){
	return bcrypt.compare(password, this.password);

	/*
	var that = this; //b/c need password from schema bottom will be scope of Promise
	return new Promise(function(resolve, reject){
	bcrypt.compare(password, that.password, function(err, res){
		if(err){
			return reject(err); //automatically terminate
		}

		return resolve(res);
	});

});*/
}

schema.statics.hashPassword = function hashPassword(password){
	return bcrypt.hashSync(password, saltRounds);
}
module.exports = mongoose.model('users', schema);
