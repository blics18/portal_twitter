var mongoose = require('mongoose');

var schema = mongoose.Schema({
		firstName : {type: String},
		lastName : {type: String},
		username: {type: String, unique: true},
		email: {type: String, unique: true},
		password: {type: String}
});

module.exports = mongoose.model('users', schema);
