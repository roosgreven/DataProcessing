/* 
Name: Roos Greven
11436700
Homework week 3: make an interactive bar chart with D3.
*/

window.onload = function() {

	// set margins, width and height
	var margin = {top: 50, right: 30, bottom: 150, left: 80},
		width = 960 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	// attribute width and height to chart
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		// append g to set the chart at the right spot
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale the datapoints on range 
	var y = d3.scale.linear()
		.range([height, 0]);

	// scale the name values on range
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// variable to draw the x axis below the bars, correctly scaled
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// variable to draw the y axis on the left side, correctly scaled
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// load the data 
	d3.json("holidaydata.json", function(error, data) {

		// alert if there is an error and return to stop the script
		if (error) {
			alert("Error: " + error);
			return;
		};

		// call the function to draw the bar chart
		drawBarChart(data);
	});

	/* 
	This function sorts data, completes the scalers draws x and y axis 
	of the bar chart with the right text, draws bars and makes the bars 
	interactive by changing color and displaying the value on mouse hover. 
	Takes in list of objects. Each object contains a name and a value. 

	*/
	var drawBarChart = function(data) {

		// sort the data descending
	    data.sort(function(a, b) {
	    	return b.value - a.value;
		});

	    // set correct domains of x and y scaler
		x.domain(data.map(function(d) { return d.name }));
		y.domain([0, d3.max(data, function(d) { return d.value })]);
			
		// draw x axis with names of countries and tick marks
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			// rotate the country names
			.selectAll("text")	
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) { return "rotate(-65)" });

		// add name for the x axis
		chart.append("text")
			// set at the right position
			.attr("x", width / 2.5)
			.attr("y", height + (margin.bottom / 1.25))
			.style("font", "18px sans-serif")
			.text("Countries");
			
		// draw y axis with numbers and tick marks
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			// add name for y axis
			.append("text")
				.attr("class", "values")
				// rotate the text
				.attr("transform", "rotate (-90)")
				// set at the right position
				.attr("y", - margin.left / 1.5)
				.attr("x", - height + 60)
				.style("font", "18px sans-serif")
				.text("Number of people on holidays x1000");
			
		// draw the bars
		chart.selectAll(".bar")
			// add the data
			.data(data)
		// add rectangles for as many bars as there is data
		.enter().append("rect")
			.attr("class", "bar")
			// set x and y at the correct scaled spot for datapoints
			.attr("y", function(d) { return y(d.value) })
			.attr("x", function(d) { return x(d.name) })
			// set width and height for the bars
			.attr("width", x.rangeBand())
			.attr("height", function(d) { return height - y(d.value) })
			// function for when mouse hovers over bar
			.on("mouseover", function(d) {
				// add text at correct spot
					chart.append("text")
					// make id to be able to remove it later
					.attr("id", "interactivity")
					// 15 px above the bars
					.attr("y", y(d.value) - 15)
					// in middle of the bar
					.attr("x", x(d.name) + 6)
					.style("text-anchor", "start")
					// set correct font and size
					.style("font", "10px sans-serif")
					// add the correct value
					.text(d.value);
				// fill the bar with another color
				d3.select(this)
					.style("fill", "darkblue")
			})
			// function for when mouse is not on bar anymore
			.on("mouseout", function(d) {
				// fill the bar with the correct color again
				d3.select(this)
					.style("fill", "steelblue")
				// remove the text
				d3.select("#interactivity").remove();
			});
	};
};