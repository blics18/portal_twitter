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
}

schema.statics.hashPassword = function hashPassword(password){
	return bcrypt.hashSync(password, saltRounds);
}
module.exports = mongoose.model('users', schema);
