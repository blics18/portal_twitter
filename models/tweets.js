var mongoose = require('mongoose');

var schema = mongoose.Schema({
		tweet: {type: String, required: true},
		user: {type: Object, required: true},
		date: {type: Date, required: true}
});

module.exports = mongoose.model('page', schema);
