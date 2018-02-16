/*
Name: Roos Greven
11436700
Homework week 2: Make a line graph in Javascript with average temperatures in De Bilt in a chosen year. 
*/

// load data with XMLHttpRequest
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {

  // when the response is ready
  if (xhttp.readyState == 4 && xhttp.status == 200) {

    // get the data
    data = xhttp.responseText;

    // split every item into lines and chunks for date and temperature
    var lines = data.split('\n');
    var items = lines.map(x => x.split(',').slice(1)).slice(1, -1);
    var trimmedItems = items.map(x => x.map(y => y.trim()));

    // format data to correct datestring for new dates
    function dateFormatting(dateString) {
      var year = dateString.substr(0,4);
      var month = dateString.substr(4,2);
      var day = dateString.substr(6,2);
      var date = new Date(year, month - 1, day);
      return date
    };

    // put new dates in new array and convert temperatures to numbers
    var correctDates = trimmedItems.map(x => [dateFormatting(x[0]), parseInt(x[1])]);
        
    // find the maximum temperature
    var maxTemp = correctDates[0][1];
    for (var i = 1; i < correctDates.length; i++) {
      if (correctDates[i][1] > maxTemp) {
        maxTemp = correctDates[i][1];
      }
    }

    // find the minimum temperature
    var minTemp = correctDates[0][1];
    for (var i = 1; i < correctDates.length; i++) {
      if (correctDates[i][1] < minTemp) {
        minTemp = correctDates[i][1];
      }
    }

    // find first and last date and convert them to milliseconds
    var minDate = correctDates[0][0].getTime();
    var maxDate = correctDates[correctDates.length - 1][0].getTime();

    // calculate the alpha and beta
    function createTransform(domain, range){
      // domain is a two-element array of the data bounds [domain_min, domain_max]
      // range is a two-element array of the screen bounds [range_min, range_max]
      // this gives you two equations to solve:
      // range_min = alpha * domain_min + beta
      // range_max = alpha * domain_max + beta
      // a solution would be:

      var domain_min = domain[0];
      var domain_max = domain[1];
      var range_min = range[0];
      var range_max = range[1];

      // formulas to calculate the alpha and the beta
      var alpha = (range_max - range_min) / (domain_max - domain_min);
      var beta = range_max - alpha * domain_max;

      // returns the function for the linear transformation (y = a * x + b)
      return function(x){
        return alpha * x + beta;
      }
    };

    // create variables for width and heigth of canvas and of graph
    var canvasWidth = 800;
    var canvasHeight = 500;
    var leftSide = 100;
    var graphWidth = canvasWidth - leftSide;
    var graphHeight = 350;
    var spaceToxAxis = 10;

    // create variables for months
    // a month contains on average 30.42 days
    var oneMonth = (maxDate - minDate) / correctDates.length * 30.42;
    var months = ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"];

    // make array to determine ticks for temperature to draw
    var firstTick = Math.floor(minTemp / 50) * 5;
    var lastTick = Math.ceil(maxTemp / 50) * 5;
    var degreeTicks = [];
    for (var i = firstTick; i <= lastTick; i += 5) {
      degreeTicks.push(i);
    }

    // create variables to determine amount of pixels for data points
    var xTransform = createTransform([minDate, maxDate], [0, graphWidth]);
    var yTransform = createTransform([minTemp, maxTemp], [0, graphHeight]);

    // create variables for extra space above and below datapoints
    var bottomSpace = yTransform(degreeTicks[0] * 10);
    var topSpace = (yTransform(300) - yTransform(250));
    var titleSpace = 50;

    // create canvas to draw on
    var canvas = document.getElementById('myCanvas'); 
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var ctx = canvas.getContext('2d');

    // draw title on correct spot
    ctx.save();
    ctx.font = "30px sans-serif";
    ctx.fillText("Average temperature records in 1996 in De Bilt (NL)", leftSide, 30, graphWidth);
    ctx.restore();

    // create gradient for a nice touch
    var grd = ctx.createRadialGradient(graphWidth / 2, graphHeight / 2, 50, graphWidth / 2, graphHeight / 2, 500);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, "gray");

    // fill graph with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(leftSide - spaceToxAxis, titleSpace, graphWidth + 10, graphHeight - bottomSpace  + topSpace); 

    // draw the x axis
    ctx.beginPath();
    ctx.moveTo(leftSide, graphHeight + titleSpace - bottomSpace  + topSpace);
    ctx.lineTo(canvasWidth, graphHeight + titleSpace - bottomSpace  + topSpace);
    ctx.stroke();

    // make the lines black
    ctx.fillStyle = 'black';

    // variable to draw length of tick marks
    var tickLength = 5;

    // draw tick marks on x axis
    for (var i = 0; i < months.length; i++) {

      // draw the tick marks
      ctx.beginPath();
      ctx.moveTo(xTransform(minDate + oneMonth * i) + leftSide, graphHeight + titleSpace - bottomSpace + topSpace);
      ctx.lineTo(xTransform(minDate + oneMonth * i) + leftSide, graphHeight + titleSpace - bottomSpace + topSpace + tickLength);
      ctx.stroke();

      // write names of months at tick marks
      ctx.fillText(months[i], xTransform(minDate + oneMonth * i) + leftSide + 5, graphHeight + titleSpace + 20 - bottomSpace + topSpace, xTransform(minDate + oneMonth));
    }

    // write legenda for x axis at correct spot
    ctx.fillText("Months in 1996", leftSide - spaceToxAxis, graphHeight + titleSpace + 40 - bottomSpace + topSpace, graphWidth);

    // draw y axis
    ctx.beginPath();
    ctx.moveTo(leftSide - spaceToxAxis, graphHeight + titleSpace - bottomSpace + topSpace);
    ctx.lineTo(leftSide - spaceToxAxis, titleSpace);
    ctx.stroke();

    // draw tick marks on y axis
    for (var i = 0; i < degreeTicks.length; i++) {

      // draw the tick marks
      ctx.beginPath();
      ctx.moveTo(leftSide - spaceToxAxis, graphHeight + titleSpace - yTransform(degreeTicks[i] * 10) + topSpace);
      ctx.lineTo(leftSide - spaceToxAxis - tickLength, graphHeight + titleSpace - yTransform(degreeTicks[i] * 10) + topSpace);
      ctx.stroke();

      // write down the degrees at tick marks
      ctx.fillStyle = 'black';
      ctx.fillText(degreeTicks[i], leftSide - spaceToxAxis - 20, graphHeight + titleSpace - yTransform(degreeTicks[i] * 10) + topSpace);
    }

    // write legenda for y axis at the correct spot
    ctx.fillText("Degrees", 20, graphHeight + titleSpace - bottomSpace + topSpace);


    // draw lines from and to all datapoints
    for (var i = 1; i < correctDates.length; i++) {
      ctx.beginPath();
      ctx.moveTo(xTransform(correctDates[i - 1][0]) + leftSide, graphHeight + titleSpace + topSpace - yTransform(correctDates[i - 1][1]));
      ctx.lineTo(xTransform(correctDates[i][0]) + leftSide, graphHeight + titleSpace + topSpace - yTransform(correctDates[i][1]));
      ctx.stroke();
    };
  }
};
xhttp.open("GET", "rawdata.csv", true);
xhttp.send();
