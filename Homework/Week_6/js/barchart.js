/* 
Name: Roos Greven
11436700
Homework week 6: linked views with d3.
Script to create bar charts
*/

/* This function creates an interactive bar chart. It finds
the data of the wanted country, displays the name of the country 
and the GDP value of that country, creates the chart and the bars
and makes the bars interactive. If the chart has been made before,
it only updates the data of the bars. Takes in array of objects with
data for the chart, the countrycode of the wanted country, the name 
of the wanted country and and array of objects of GDP per capita data. 
*/
function drawBarchart(inequalityData, countrycode, countryName, GDPdata) {

	var thisCountry;
	var thisCountryGDP;

	// variable with inequalitydata for selected country
	for (let i = 0; i < inequalityData.length; i++) {
		if (inequalityData[i].countrycode == countrycode) {
			thisCountry = inequalityData[i];
			break;
		};
	};

	// variable with GDP data for selected country
	for (let i = 0; i < GDPdata.length; i++) {
		if (GDPdata[i].countrycode == countrycode) {
			thisCountryGDP = GDPdata[i];
			break;
		};
	};

	// make array of objects for selected country
	country = [
	{"year": "2005", "value": thisCountry.inequality2005}, 
	{"year": "2010", "value": thisCountry.inequality2010},
	{"year": "2012", "value": thisCountry.inequality2012},
	{"year": "2015", "value": thisCountry.inequality2015}
	];

	// add the title and GPD value of the graph
	document.getElementById("title").innerHTML = "<h1 class = 'titleChart'>Gender equality in:<br>" + countryName + 
	"</h1><h3 class = 'displayValues'>GDP per capita: $" + thisCountryGDP.GDP + "</h3>"; 

	// set margins, width and height
	var margin = {top: 20, right: 30, bottom: 80, left: 50},
		width = 400 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// attribute width and height to chart
	chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale the name values on range
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1)
		.domain(country.map(function(d) { return d.year; }));

	// scale the datapoints on range 
	var y = d3.scale.linear()
		.range([height, 0])
		.domain([20, 85]);
		
	// variable to draw the x axis below the bars, correctly scaled
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// variable to draw the y axis on the left side, correctly scaled
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// make svg for chart if there is none
	if (chartCreated == false) {
		d3.select(".forChart")
			.append("svg")
				.attr("class", "chart");

		// draw x axis with names of countries and tick marks
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")	
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) { return "rotate(-65)"; });

		// add name for the x axis
		chart.append("text")
			.attr("x", width / 2.5)
			.attr("y", height + (margin.bottom / 1.25))
			.style("font", "18px sans-serif")
			.text("Year");
			
		// draw y axis with numbers and tick marks
		chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("class", "values")
				.attr("transform", "rotate (-90)")
				.attr("y", - margin.left / 1.5)
				.attr("x", - height + 20)
				.style("font", "18px sans-serif")
				.text("Inequality Index");

		// draw the bars
		chart.selectAll(".bar")
			.data(country)
			.enter().append("rect")
				.attr("class", "bar")
				.attr("y", function(d) { return y(d.value); })
				.attr("x", function(d) { return x(d.year); })
				.attr("width", x.rangeBand())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", "steelblue")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);	
		chartCreated = true;
	}

	// if there is already a graph
	else {
		// remove all existing bars
		d3.selectAll(".bar").remove();

		// draw new bar chart with new data
		chart.selectAll(".bar")
			.data(country)
			.enter().append("rect")
				.attr("class", "bar")
				.attr("y", function(d) { return y(d.value); })
				.attr("x", function(d) { return x(d.year); })
				.attr("width", x.rangeBand())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", "steelblue")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);	
	};

	// display values and change color when hovering over with mouse
	function mouseover(d) {
		chart.append("text")
			.attr("id", "interactivity")
			.attr("y", y(d.value) - 15)
			.attr("x", x(d.year) + 23)
			.style("text-anchor", "start")
			.style("font", "10px sans-serif")
			.text(d.value);

		d3.select(this)
			.style("fill", "darkblue");
	};

	// change back to old color when hovering away
	function mouseout(d) {
		d3.select(this)
			.style("fill", "steelblue");

		d3.select("#interactivity").remove();
	};
};