var hourBlock = $('.hour-block');
var saveButton = $('.saveBtn');
var currentDay = $('#currentDay');
var calendar = $('.calendar');

function CalendarEvent(index,hour,event) {
  this.index = index;
  this.hour = hour;
  this.event = event;
};

var calendarList = [];
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

  $(".saveBtn").on('click', function (event){
    var calEventName = $(".saveBtn",this).prevObject.parent().children().eq(1).val();
    var scheduledHour = $(".saveBtn",this).prevObject.parent().children().eq(0).text();
    var indexSaved = $(".saveBtn",this).prevObject.parent()[0].id;
    var savedEvent = new CalendarEvent(indexSaved,scheduledHour,calEventName);
    calendarList.push(savedEvent);
    var savedEvents = localStorage.getItem('calEvents');
    if (savedEvents != null) {
      var savedEventsArray = JSON.parse(savedEvents);
        savedEventsArray.forEach(event => {
          if(event.index != null)
          {
            calendarList.push(event);
          }
        });
    }
    localStorage.setItem('calEvents', JSON.stringify(calendarList));
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