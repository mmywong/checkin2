/**
 * Created by kaseymunetake on 3/2/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeesSchema = new Schema({
    userid: String,
    firstname: String,
    lastname: String,
    checkedin: Boolean
});

module.exports = mongoose.model('employees', employeesSchema);