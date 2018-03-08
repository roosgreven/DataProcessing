/* 
Name: Roos Greven
11436700
Homework week 4: make an interactive scatterplot with D3.
*/

window.onload = function() {
	createPlot();
};

function createPlot() {
// set margins, width and height
	var margin = {top: 30, right: 120, bottom: 60, left: 80},
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		gradientHeight = 200,
		gradientWidth = 40;

	// attribute width and height to chart and append g to set the chart at the right spot
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale the datapoints on range 
	var y = d3.scale.linear()
		.range([height, 0]);

	// scale the name values on range
	var x = d3.scale.linear()
		.range([0, width]);

	// variable to draw the x axis below the bars, correctly scaled
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// variable to draw the y axis on the left side, correctly scaled
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// set color range
	var color = d3.scale.linear()
	.range(["#FFffff", "#000099"]);

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// load json data
	d3.json("data2017.json", function(error, data) {

		// when there is an error, throw error
		if (error) {
			alert("error" + error);
		};

		// call function to draw scatterplot
		drawScatterplot(data);
			
	});


	/*
	This function draws x and y axis and tick marks and names for both. 
	It draws the dots and makes them interactive by displaying all values.
	Takes in list of objects. Each object contains the values for both
	axes, a variable for the color and a countryname. Finally calls
	a function to draw the legend.
	*/
	function drawScatterplot(data) {

		// set correct domains of x and y scaler
		x.domain(d3.extent(data, function(d) { return d.generosity; }));
		y.domain(d3.extent(data, function(d) { return d.happiness; })).nice();

		// set correct domain for color scale
		color.domain([d3.min(data, function(d) { return d.freedom }), 
			d3.max(data, function(d) { return d.freedom })]);

		// draw x axis with names of countries (rotated) and tick marks
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
			.attr("x", width / 2.5)
			.attr("y", height + margin.bottom - 10)
			.style("font", "18px sans-serif")
			.text("Generosity");

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
				.text("Happiness");

		// draw dots at the correct position with correct color
		chart.selectAll(".dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", function(d) { return x(d.generosity); })
				.attr("cy", function(d) { return y(d.happiness); })
				.style("fill", function(d) { return color(d.freedom); })
				// display values when hovering over dots
				.on("mouseover", function(d) {
					tooltip.transition()
					.duration(200)
					.style("opacity", .9);
					tooltip.html("Country: <span style='color:red'>" + d.country 
						+ "</span> <br/>Happiness: <span style='color:red'>" 
						+ (Math.round(d.happiness * 100) / 100) 
						+ "</span><br/>Generosity: <span style='color:red'>" 
						+ (Math.round(d.generosity * 100) / 100) 
						+ "</span><br/>Freedom: <span style='color:red'>" 
						+ (Math.round(d.freedom * 100) / 100) + "</span>")
						.style("left", (d3.event.pageX - 90) + "px")     
						.style("top", (d3.event.pageY - 77) + "px");
				})
				.on("mouseout", function(d) {
					tooltip.transition()
						.duration(500)
						.style("opacity", 0);
					});

		// call function to draw the legend
		drawLegend(data);
	};

	/*
	This function creates a legend. It creates color gradient and 
	sets it at right position, scales and draws y axis for legend
	and draws y axis title. Takes in list of objects. Each object 
	needs the variable for color.
	*/
	function drawLegend(data) {

		// set color gradient at right positions
		var legend = chart.append("defs")
			.append("svg:linearGradient")
				.attr("id", "gradient")
				.attr("x1", "100%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "100%")
				.attr("spreadMethod", "pad");

		// set stop to gradient color at right spot
		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#000099")
			.attr("stop-opacity", 1);

		// set stop to gradient color at right spot
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#FFffff")
			.attr("stop-opacity", 1);

		// place the color gradient at the correct spot
		chart.append("rect")
			.attr("width", gradientWidth)
			.attr("height", gradientHeight)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(" + width + ", 0)");

		// scale y axis
		var y = d3.scale.linear()
			.range([gradientHeight, 0])
			.domain([d3.min(data, function(d) { return d.freedom }), 
				d3.max(data, function(d) { return d.freedom })]).nice();

		// create y axis
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("right");

		// draw y axis at right spot with legend title
		chart.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (width + gradientWidth) + ",0)")
			.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 50)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Freedom score");
	};
};
