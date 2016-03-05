/**
 * Created by kaseymunetake on 3/2/16.
 */
var express = require('express');
var router = express.Router();

var employeeModel = require('../models/employees');
var timelogModel = require('../models/timelog') ;

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
  renderConfirmPage(res, "", "The Portal", true);
});

/* GET the user's time Log page. */
router.get('/log', function(req, res, next) { // add :id later
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

  // Look for the userid to see if it exists
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

      // Find the user's most recent time log entry
      timelogModel.find({userid: userId}, function(err, docs){
        if (err) throw err;
        var currentLog = docs.length - 1;
        var logId = docs[currentLog]._id;
        timeOut = Date.now();

        // Add the user's checkout time
        timelogModel.update({_id: logId}, {timeout: timeOut}, function(err, doc){
          if (err) throw err;
          console.log("Updated the timelogModel!");

          // Change the checkedin boolean for the user in employeeModel
          checkedIn = false;

          employeeModel.update({_id: id}, {checkedin: checkedIn}, function(err, doc){

            console.log("Updated the employeeModel!");
            //printEmployeeData(id);
            //printTimelogData(userId);

            // Redirect to the Confirm page
            renderConfirmPage(res, userId, firstName, checkedIn);
          });
        });
      });
    }
    // If the user is currently checked out
    else if(checkedIn == false){
      console.log("Need to check in!");

      // Create a new time log
      var newTimelog = createNewTimelog(userId, timeIn, timeOut);

      // Save the time log
      newTimelog.save({}, function(err, doc){
        if (err) throw err;
        console.log("Time added to the timelogModel!");

        // Change the checkedin boolean for the user in employeeModel
        checkedIn = true;

        employeeModel.update({_id: id}, {checkedin: checkedIn}, function(err, doc){

          console.log("Updated the employeeModel!");
          //printEmployeeData(id);
          //printTimelogData(userId);

          // Redirect to the Confirm page
          renderConfirmPage(res, userId, firstName, checkedIn);
        });
      });
    }
  });
});

router.post('/confirm', function(req, res){
  var userId = req.body.user_id;
  var offset = req.body.offset;
  var today = new Date();
  var sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 7 * offset) - today.getDay());
  var sundayOfNextWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 7 * offset + 7) - today.getDay());
  console.log(sundayOfWeek);
  console.log(sundayOfNextWeek);

  timelogModel.find({userid: userId, timeout: {$gt: sundayOfWeek.getTime(), $lt: sundayOfNextWeek.getTime()}}, function(err, doc){

    //console.log(doc);

    var sundayHours = 0;
    var sundayTimes = [];
    var mondayHours = 0;
    var mondayTimes = [];
    var tuesdayHours = 0;
    var tuesdayTimes = [];
    var wednesdayHours = 0;
    var wednesdayTimes = [];
    var thursdayHours = 0;
    var thursdayTimes = [];
    var fridayHours = 0;
    var fridayTimes = [];
    var saturdayHours = 0;
    var saturdayTimes = [];

    // TODO: Separate All Entries Into Separate Day of Week, Number of Hours
    for(var i = 0; i < doc.length; i++){
      var timein = new Date(doc[i].timein);
      var timeout = new Date(doc[i].timeout);

      //console.log(timein.getDay());
      //console.log(timeout.getDay());
      //console.log((timeout - timein) / 3600 / 1000);
      switch(timeout.getDay()){
        case 0:
          sundayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          sundayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 1:
          mondayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          mondayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 2:
          tuesdayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          tuesdayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 3:
          wednesdayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          wednesdayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 4:
          thursdayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          thursdayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 5:
          fridayTimes.push({timein: timein.getHours() + ":" + ("0" + timein.getMinutes()).slice(-2), timeout: timeout.getHours() + ":" + ("0" + timeout.getMinutes()).slice(-2)});
          fridayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        case 6:
          saturdayTimes.push({timein: timein.getHours() + ":" + ("0" + ("0" + timein.getMinutes()).slice(-2)).slice(-2), timeout: timeout.getHours() + ":" + ("0" + ("0" + timeout.getMinutes()).slice(-2)).slice(-2)});
          saturdayHours = sundayHours + (timeout - timein) / 3600 / 1000;
          break;
        default:
          break;
      }
      console.log(saturdayTimes);
      console.log(saturdayHours);

      var totalHours = sundayHours + mondayHours + tuesdayHours + wednesdayHours + thursdayHours + fridayHours + saturdayHours;

      var output = {
          data: {
            totalHours: totalHours.toFixed(2),
            sundayHours: sundayHours.toFixed(2),
            sundayTimes: sundayTimes,
            mondayHours: mondayHours.toFixed(2),
            mondayTimes: mondayTimes,
            tuesdayHours: tuesdayHours.toFixed(2),
            tuesdayTimes: tuesdayTimes,
            wednesdayHours: wednesdayHours.toFixed(2),
            wednesdayTimes: wednesdayTimes,
            thursdayHours: thursdayHours.toFixed(2),
            thursdayTimes: thursdayTimes,
            fridayHours: fridayHours.toFixed(2),
            fridayTimes: fridayTimes,
            saturdayHours: saturdayHours.toFixed(2),
            saturdayTimes: saturdayTimes
          }
      };

      console.log(output);

      res.render('checkin/log', output)

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
};

// Render the confirm.ejs file.
function renderConfirmPage(res, userid, name, checkedIn){
  res.render('checkin/confirm', {
    user_id: userid,
    first_name: name,
    is_checking_in: checkedIn
  });
};

function printEmployeeData(id){
  employeeModel.find({_id: id}, function(err, docs){
    console.log(docs);
  });
};

function printTimelogData(userId){
  timelogModel.find({userid: userId}, function(err, docs){
    console.log(docs);
  });
};

module.exports = router;