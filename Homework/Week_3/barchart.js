/* 
Name: Roos Greven
11436700
Homework week 3: make an interactive bar chart with D3.
*/

d3.json("holidaydata.json", function(error, data) {
    
	// alert if there is an error
	if (error) {
		alert("Error: " + error);
	};

    // make arrays for datapoints
    var totals = [];
    var countries = [];

    // save datapoints in arrays
    for (var i = 0; i < data.length; i++) {
    	totals.push(data[i].total);
    	countries.push(data[i].country);
    }

    // set margins, width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    	width = 960 - margin.left - margin.right,
    	height = 400 - margin.top - margin.bottom;

    // scale the ordinal values
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1)
		.domain(countries);

    // scaler for the width of datapoints
    var y = d3.scale.linear()
		.domain([0, d3.max(totals)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	// attribute width and height to chart
    var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Frequency");

	chart.selectAll(".bar")
		.data(data)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("y", function(d) { return y(d.total); })
		.attr("x", function(d) { return x(d.country)})
		.attr("width", x.rangeBand())
		.attr("height", function(d) {return height - y(d.total)});
});

