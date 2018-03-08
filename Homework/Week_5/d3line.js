/* 
Name: Roos Greven
11436700
Homework week 5: make an interactive line graph with D3.
*/

/* 
This function creates the plot, draws the lines, 
makes it interactive by displaying values and drawing 
a line and a circle and adds the legend. Takes in a year,
which is later used to load the correct dataset. Finally
calls a function to draw the lines.
*/ 
function createPlot(year) {

	// clear all svgs
	d3.selectAll("svg > *").remove();
	
	// add the title of the graph
	document.getElementById("title").innerHTML = "<h1>Graph of '" + year;

	// set margins, width and height
	var margin = {top: 50, right: 100, bottom: 80, left: 80},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// attribute width and height to chart
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale the temperature and dates on range 
	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var x = d3.time.scale()
		.range([0, width]);

	// parser for dates
	var parseDate = d3.time.format("%Y%m%d").parse;
	var formatDate = d3.time.format("%d-%b-%Y");

	// set color scaler
	var color = d3.scale.ordinal() 
		.range(["purple", "blue", "red"]);

	// give correct values for line
	var line = d3.svg.line()
		.x(function(d) { return x(d.date) })
		.y(function(d) { return y(d.temperature) });

	// variable to draw the x axis below the graph, correctly scaled
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// variable to draw the y axis on the left side, correctly scaled
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// load json data
	d3.json("alldata" + year + ".json", function(error, data) {

		// when there is an error, throw error and stop script
		if (error) {
			alert("error" + error);
			return;
		};

		// parse each date to a correct format
		data.forEach(function(d) { d.date = parseDate(d.date)})

		// call function to draw graph
		drawLineGraph(data);		
	});

	/* 
	This function creates filtered data, sets domains for scalers, 
	adds the axes, draws the lines, makes the lines interactive, 
	by displaying the correct values for that spot and displaying
	a vertical line and circle that follow the mouse. Finally calls 
	a function to draw the legend.
	Takes in list of objects. Each object contains the average temperatures 
	for Chicago, Vancouver and De Bilt per day.
	*/

	drawLineGraph = function(data) {

		// define values of x axis to filter data on
		var label = 'date';

		// variable for filtered data without the label
		var varNames = d3.keys(data[0])
			.filter(function(key) { return key !== label; });

		// create an object with the filtered data 
		var seriesData = varNames.map(function (name) {
			return {
				name: name,
				values: data.map(function (d) {
					return {date: d[label], temperature: d[name] };
				})
			};
		});

		// set the domain of the color scaler
		color.domain(varNames);

		// set domains of x and y scalers
		x.domain(d3.extent(data, function(d) { return d.date}));
		y.domain([ 
			d3.min(seriesData, function (c) { 
				return d3.min(c.values, function (d) { return d.temperature; });
			}),
			d3.max(seriesData, function (c) { 
				return d3.max(c.values, function (d) { return d.temperature; });
			})
		]);

		// draw x axis with names of countries and tick marks
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")	
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) { return "rotate(-65)" });

		// add name for the x axis at the right position
		chart.append("text")
			.attr("x", width / 2.3)
			.attr("y", height + 65)
			.style("font", "18px sans-serif")
			.text("Months");

		// draw y axis with numbers and tick marks, name for x axis (rotated and at right position)
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("class", "values")
				.attr("transform", "rotate (-90)")
				.attr("y", -40)
				.attr("x", - height + (height / 2.5))
				.style("font", "18px sans-serif")
				.text("Temperature");

		// add group elements to the chart for the lines
		var series = chart.selectAll(".series")
			.data(seriesData)
			.enter().append("g")
				.attr("class", "series");

		// append path to draw the line
		series.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function (d) { return color(d.name); })
			.attr('stroke-width', 2)
			.attr('fill', 'none');

		// add the correct description for the lines at the right spot 
		series.append("text")
			.datum(function(d) {
				return {
					name: d.name,
					temperature: d.values[d.values.length - 1]
				};
			})
			.attr("transform", function(d) {
				return "translate(" + (width + 5) + "," + y(d.temperature.temperature) + ")";
			})
			.attr("x", 0)
			.attr("dy", ".35em")
			.attr("class", "linetext")
			.text(function(d) {
				return d.name;
			});


		// append g for mouse over effects
		var mouseG = series.append("g")
			.attr("class", "mouse-over-effects");

		// create the black vertical line to follow mouse
		mouseG.append("path") 
			.attr("class", "mouse-line")
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", "0");

		// make variable with the drawn lines
		var lines = document.getElementsByClassName('line');

		// add date to all the lines for interactivity
		var mousePerLine = mouseG.append("g")
				.attr("class", "mouse-per-line");

		// add the circle to follow line
		mousePerLine.append("circle")
			.attr("r", 7)
			.style("stroke", function(d) {
				return color(d.name);
			})
			.style("fill", "none")
			.style("stroke-width", "2px")
			.style("opacity", "0");

		// add text to display temperature
		mousePerLine.append("text")
			.attr("class", "tempText")
			.attr("transform", "translate(10,3)");

		// add text to display date
		mousePerLine.append("text")
			.attr("class", "dateText")
			.attr("dy", "1em")
			.attr("transform", "translate(10,3)")

		// add rectangle on current svg to catch mouse on canvas
		mouseG.append('svg:rect') 
			.attr('width', width)
			.attr('height', height)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('mouseout', function() { // on mouse out hide line, circles and text
				d3.select(".mouse-line")
			  		.style("opacity", "0");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "0");
				})
			.on('mouseover', function() { // on mouse in show line, circles and text
				d3.select(".mouse-line")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "1");
			})
			.on('mousemove', mouseMove);

		/*
		This function contains mouse positions, calculates the datapoints that 
		belong to the mouse position and writes text of the values. 
		*/

		function mouseMove() { // move mouse when mouse moving over canvas
				var mouse = d3.mouse(this);
				d3.select(".mouse-line")
					.attr("d", function() {
						var d = "M" + mouse[0] + "," + height;
						d += " " + mouse[0] + "," + 0;
						return d;
					});
				// calculate positions for and set interactivity
				d3.selectAll(".mouse-per-line")
					.attr("transform", function(d, i) {
						var xDate = x.invert(mouse[0]), 
							bisect = d3.bisector(function(d) { return d.date; }).right;
							idx = bisect(d.values, xDate); 

						var beginning = 0,
							end = lines[i].getTotalLength(), 
							target = null;

						while (true) {
							target = Math.floor((beginning + end) / 2);
							pos = lines[i].getPointAtLength(target); 
							if ((target === end || target === beginning) && pos.x !== mouse[0]) {
								break;
							}
							if (pos.x > mouse[0])  end = target ;
							else if (pos.x < mouse[0])  beginning = target;
							else break;
						}
						// add text with values
						d3.select(this).select('.tempText')
							.text("Temperature: " + y.invert(pos.y).toFixed(0));

						d3.select(this).select('.dateText')
							.text("Date: " + formatDate(x.invert(mouse[0])));

						return "translate(" + mouse[0] + "," + pos.y +")";
					});
		};

		drawLegend(seriesData);
	}

	/*
	This function creates a legend. It sets it at right position 
	and scales. Takes in list of objects. Each object 
	needs the variable for color.
	*/

	drawLegend = function(data) {

		// set sizes for legend
		var legendRectSize  = 15;
		var legendSpacing = 6;
		
		// ordinal scaler to set colors
		var legendColor = d3.scale.ordinal()
		.domain(["Chicago", "De Bilt", "Vancouver"])
		.range(["purple", "blue", "red"]);

		// add an svg for the legend
		var theLegend = chart.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(50, 50)");

		// add space for legend and set it at the right spot
		var legend = theLegend.selectAll(".legend")
			.data(legendColor.domain())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) {
				var height = legendRectSize + legendSpacing;
				var offset =  height * legendColor.domain().length / 2;
				var horz = -2 * legendRectSize;
				var vert = i * height - offset;
				return "translate(" + horz + "," + vert + ")"; });

		// add rectangles for color
		legend.append("rect")
			.attr("width", legendRectSize)
			.attr("height", legendRectSize)
			.style("fill", legendColor)
			.style("stroke", legendColor);

		// add the text per block
		legend.append("text")
			.attr("x", legendRectSize + legendSpacing)
			.attr("y", legendRectSize - legendSpacing)
			.style("font", "sans-serif")
			.text(function(d) { return d; });
	};
};
