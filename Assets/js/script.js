var hourBlock = $('.hour-block');
var saveButton = $('.saveBtn');
var currentDay = $('#currentDay');
var calendar = $('.calendar');

//creates a constructor function to create objects from
function CalendarEvent(index, hour, event) {
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

  //Creating time hour blocks from 9AM -6PM
  for (var i = 9; i < 19; i++) {
    var addedClass;
    //for the first block which we have html for, set hour time,
    //add index id for later reference and call function to add coloring class
    if (i === 9) {
      hourBlock.children().eq(0).text(i + amPm);
      hourBlock.attr('id', index);
      addedClass = compareTime(i, hourBlock);
      getSavedEvent(index);
    }
    else {
      index += 1;
      amPm = "PM";
      //for each block after the first, we just create a clone and
      //append it to calendar. Remove the class we added to the first block
      //we cloned from and add unique id
      var timeSlot = hourBlock.clone().appendTo(calendar);
      timeSlot.removeClass(addedClass);
      timeSlot.attr('id', index);
      if (i > 12) {
        //setting time to display in 12 hour cycle
        timeSlot.children().eq(0).text(Math.abs([i - 12]) + amPm);
      }
      else {
        if (i < 12) {
          amPm = "AM";
        }
        timeSlot.children().eq(0).text(i + amPm);
      }
      //add class coloring based on hour and call getSavedEvent to
      //populate text area from localstorage if applicable
      compareTime(i, timeSlot);
      getSavedEvent(index);
    }
  }

  //controls click events for save buttons. We get the index, hour, and event
  //for the button's direct parent with 'this' keyword. Create a new object with the retrieved
  // values and push it to the array. Then check if local storage already contains
  //values. If so, we need to push those values onto the array as well otherwise, they
  //will get overwritten. Then just set local storage to array.
  $(".saveBtn").on('click', function () {
    var calEventName = $(".saveBtn", this).prevObject.parent().children().eq(1).val();
    var scheduledHour = $(".saveBtn", this).prevObject.parent().children().eq(0).text();
    var indexSaved = $(".saveBtn", this).prevObject.parent()[0].id;
    var savedEvent = new CalendarEvent(indexSaved, scheduledHour, calEventName);
    calendarList.push(savedEvent);
    var savedEvents = localStorage.getItem('calEvents');
    if (savedEvents != null) {
      var savedEventsArray = JSON.parse(savedEvents);
      savedEventsArray.forEach(event => {
        if (event.index != null) {
          calendarList.push(event);
        }
      });
      //filtering calendarList down to contain only unique objects, otherwise
      //the list contained duplicates if there was more than one event written upon button click
      var uniqueList = [];
      calendarList.filter(function(item){
        var i = uniqueList.findIndex(x => (x.index == item.index && x.hour == item.hour && x.event == item.event));
        if(i <= -1){
          uniqueList.push(item);
        }    
      });

      localStorage.setItem('calEvents', JSON.stringify(uniqueList));
    }
    else{
      localStorage.setItem('calEvents', JSON.stringify(calendarList));
    }
  });
});

//adds class to element which dictates its coloring
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

//retrieves local storage, checks if any objects in storage contains
//same index as the current element.If so, get that object and set the
//textarea to that object's saved event, else set it to blank.
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