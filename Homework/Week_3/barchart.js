/* 
Name: Roos Greven
11436700
Homework week 3: make an interactive bar chart with D3.
*/

// set margins, width and height
var margin = {top: 50, right: 30, bottom: 150, left: 40},
	width = 960 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

// attribute width and height to chart
var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// scaler for the width of datapoints
var y = d3.scale.linear()
	.range([height, 0]);

// scale the country values
var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1)

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10);

d3.json("holidaydata.json", function(error, data) {
    
	// alert if there is an error
	if (error) {
		alert("Error: " + error);
	};

    // set correct domains of x and y scaler
	x.domain(data.map(function(d) { return d.country }));
	y.domain([0, d3.max(data, function(d) { return d.total })]);
		
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

	// draw y axis with numbers and tick marks
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Frequency x1000");

	// draw the bars
	chart.selectAll(".bar")
		.data(data)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("y", function(d) { return y(d.total) })
		.attr("x", function(d) { return x(d.country) })
		.attr("width", x.rangeBand())
		.attr("height", function(d) { return height - y(d.total) })
		.on("mouseover", function(d) {
			chart.append("text")
				.attr("y", y(d.total) - 15)
				.attr("x", x(d.country) + 4)
				.attr("id", "t" + d.total)
				.style("text-anchor", "start")
				.text(d.total);
			d3.select(this)
				.style("fill", "darkblue")
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("fill", "steelblue")
			d3.select("#t" + d.total).remove();
		});
});

