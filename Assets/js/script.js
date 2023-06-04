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
var index = 0;

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Displays the current date in the header section of the page.
  currentDay.text(today.format('dddd, MMMM D'));

  for (var i = 9; i < 19; i++) {
    var addedClass;
    if (i === 9) {
      hourBlock.children().eq(0).text(i + amPm);
      hourBlock.attr('id', index);
      addedClass = compareTime(i, hourBlock);
      getSavedEvent(index);    
    }
    else {
      index += 1;
      amPm = "PM";
      var timeSlot = hourBlock.clone().appendTo(calendar);
      timeSlot.removeClass(addedClass);
      timeSlot.attr('id', index);
      if (i > 12) {
        timeSlot.children().eq(0).text(Math.abs([i - 12]) + amPm);
      }
      else {
        if (i < 12) {
          amPm = "AM";
        }
        timeSlot.children().eq(0).text(i + amPm);
      }
      compareTime(i, timeSlot);
      getSavedEvent(index);  
    }
  }

  $(".saveBtn").each(function (index) {
    $(this).on('click', function () {
      var calEventName = $.trim($('textarea').eq(index).val());
      var scheduledHour = $.trim($(this).parent().closest('div').text());
      calendarEvent.push({ index: index, hour: scheduledHour, event: calEventName });
      var savedEvents = localStorage.getItem('calEvents');
      if (savedEvents != null) {
        var savedEventsArray = JSON.parse(savedEvents);
        savedEventsArray.forEach(event => {
          calendarEvent.push(event);
        });
      }
      localStorage.setItem('calEvents', JSON.stringify(calendarEvent));
    });
  });
});

function compareTime(hour, timeSlot) {
  var classColoring;
  //if current Hour equals time slot hour than set to present
  if (currentHour == hour) {
    timeSlot.addClass("present");
    classColoring = "present";
  }//if current Hour is less than(earlier) than the time slot time add future class
  else if (currentHour < hour) {
    timeSlot.addClass("future");
    classColoring = "future";
  }//if current Hour is greater than(later) than the time slot time add past class
  else {
    timeSlot.addClass("past");
    classColoring = "past";
  }
  return classColoring;
}

function getSavedEvent(indexEvent) {
  var savedEvents = localStorage.getItem('calEvents');
  if (savedEvents != null) {
    var savedEventsArray = JSON.parse(savedEvents);
    if (savedEventsArray.some(event => event.index == indexEvent)) {
      var savedTimeSlotEvent = savedEventsArray.find(event => event.index == indexEvent);
      $('#' + index).children("textarea").text(savedTimeSlotEvent.event);
    }
    else {
      $('#' + index).children("textarea").text("")
    }
  }
}