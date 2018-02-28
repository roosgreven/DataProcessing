var happinessData = []

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

	var color = d3.scale.linear()
	.domain([0, 0.7])
	.range(["#ffffb2","#bd0026"]);

	d3.json("data2017.json", function(error, data) {
		if(error) {
			alert("error" + error);
		};

		console.log("max"+ d3.max(data, function(d) { return d.freedom }));
		console.log("min" + d3.min(data, function(d) { return d.freedom}));

		drawScatterplot(data);
		
	})

	var drawScatterplot = function(data) {

		// set correct domains of x and y scaler
		x.domain(d3.extent(data, function(d) { return d.generosity; }));
		y.domain(d3.extent(data, function(d) { return d.happiness; })).nice();

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
			.text("Generosity");

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
				.attr("y", -40)
				.attr("x", - height + 60)
				.style("font", "18px sans-serif")
				.text("Happiness");


		chart.selectAll(".dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", function(d) { return x(d.generosity); })
				.attr("cy", function(d) { return y(d.happiness); })
				.style("fill", function(d) { return color(d.freedom); });
			

	};
};