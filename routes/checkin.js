/**
* Created by kaseymunetake on 3/2/16.
*/
var express = require('express');
var router = express.Router();

var employeeModel = require('../models/employees');
var timelogModel = require('../models/timelog');

/* FOR BACK-END TESTING ONLY. DELETE LATER. */
router.get('/test', function(req, res, next) {
  res.render('checkin/test', {
    title: 'The Portal Check-in System'
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('checkin/index', {
    title: 'The Portal Check-in System'
  });
});

/* GET the Confirm page. */
router.get('/confirm', function(req, res, next) {
  renderConfirmPage(res, "", "The Portal");
});

/* GET the user's time Log page. */
router.get('/log', function(req, res, next) {
  res.render('checkin/log', {
    title: 'Express'
  });
});

/* POST the user's ID number. Compare to the database.
If no error, redirect to the Confirm page. */
router.post('/', function(req, res){

  console.log("Submit button has been pressed.");

  var id = "";
  var userId = req.body.user_id;
  var firstName = "";
  var checkedIn = false;
  var timeIn = Date.now();  // Get the current time
  var timeOut = 0;

  // var emptyEmployee = new employeeModel({
  //   userid: userId,
  //   firstname: firstName,
  //   lastname: "",
  //   checkedin: checkedIn
  // });

  employeeModel.find({userid: userId}, function(err, docs){
    // TODO: Add error handling
    if (err) throw err;
    console.log(userId);
    id = docs[0]._id;
    firstName = docs[0].firstname;
    checkedIn = docs[0].checkedin;

    // If the user is already checked in
    if(checkedIn == true){
      console.log("Need to check out!");

      // TODO: Checking out
    }
    // If the user is currently checked out
    else if(checkedIn == false){
      console.log("Need to check in!");

      // Create a new time log
      var newTimelog = createNewTimelog(userId, timeIn, timeOut);

      // Save the time log
      newTimelog.save({}, function(err, doc){
        if (err) throw err;
        console.log("Time added!");

        // Change the checkedin boolean for the user in employeeModel
        checkedIn = true;

        employeeModel.update({_id: id, checkedin: checkedIn}, function(err, doc){
          // Redirect to the Confirm page
          console.log("Updated!");

          //printEmployeeData(id);
          //printTimelogData(userId);

          renderConfirmPage(res, userId, firstName);
        });
      });
    }
  });
});

// Create a new timelogModel entry.
function createNewTimelog(userid, timein, timeout){
  var timelog = new timelogModel({
    userid: userid,
    timein: timein,
    timeout: timeout
  });
  return timelog;
}

// Render the confirm.ejs file.
function renderConfirmPage(res, userid, name){
  res.render('checkin/confirm', {
    user_id: userid,
    first_name: name
  });
}

function printEmployeeData(id){
  employeeModel.find({_id: id}, function(err, docs){
    console.log(docs);
  });
}

function printTimelogData(userId){
  timelogModel.find({userid: userId}, function(err, docs){
    console.log(docs);
  });
}

module.exports = router;
