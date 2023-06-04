var hourBlock = $('.hour-block');
var saveButton = $('.saveBtn');
var currentDay = $('#currentDay');
var calendar = $('.calendar');

var calendarEvent = [{
  index: Number,
  hour: String,
  event: String
}];

var today = dayjs();
var currentHour = today.format('H');
var amPm = "AM";

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?

  //hourBlock.addClass('future');//past,future
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  currentDay.text(today.format('dddd, MMMM D'));

  for (var i = 9; i < 19; i++) {  
    var addedClass; 
    if(i===9)
    {
      hourBlock.children().eq(0).text(i + amPm);
      addedClass = compareTime(i,amPm,hourBlock);
    }
    else
    {
      amPm = "PM";
      var timeSlot = hourBlock.clone().appendTo(calendar);
      timeSlot.removeClass(addedClass);
      if (i > 12) {
        timeSlot.children().eq(0).text(Math.abs([i - 12]) + amPm);
      }
      else {
        if (i < 12) {
          amPm = "AM";
        }
        timeSlot.children().eq(0).text(i + amPm);
      }
      compareTime(i,amPm,timeSlot);
    }
  }

  $(".saveBtn").each(function (index) {
    $(this).on('click', function () {
      var calEventName = $.trim($('textarea').eq(index).val());
      var scheduledHour = $.trim($(this).parent().closest('div').text());
      calendarEvent.push({ index: index, hour: scheduledHour, event: calEventName });
      console.log(calendarEvent);
    });
  });
});

function compareTime(hour, unit,timeSlot)
{
  var classColoring;
  //if current Hour equals time slot hour than set to present
  if(currentHour == hour)
  {
    timeSlot.addClass("present");
    classColoring="present";
  }//if current Hour is less than(earlier) than the time slot time add future class
  else if(currentHour < hour)
  {
    timeSlot.addClass("future");
    classColoring="future";
  }//if current Hour is greater than(later) than the time slot time add past class
  else
  {
    timeSlot.addClass("past");
    classColoring="past";
  }
  return classColoring;
}