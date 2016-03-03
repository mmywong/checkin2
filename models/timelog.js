var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timelogSchema = new Schema({
    userid: String,
    timein: Number,
    timeout: Number
});

module.exports = mongoose.model('timelog', timelogSchema);