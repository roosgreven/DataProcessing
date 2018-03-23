/* 
Name: Roos Greven
11436700
Homework week 6: linked views with d3.
*/

/* This function loads data with the help of queue when the
window is loaded. Takes in nothing. Loads data in json format. 
Calls the function to draw the map at the end. 
*/
window.onload = function() {

	// load in data about inequality and GDP per capita
	queue()
		.defer(d3.json, 'inequalityEU.json')
		.defer(d3.json, 'GDPperCapita.json')
		.defer(d3.json, "https://raw.githubusercontent.com/openspending/subsidystories.eu/master/app/data/ne_50m_admin_0_countries_simplified.json")
		.await(createMap);
};

// define a few global variables
var europeNames = [];
var color;
var chartCreated = false;

// define width and height
var w = 550,
	h = 450;

// set margins
var margin = {top: 30, right: 80};

/*
This function creates a legend. It creates color gradient and 
sets it at right position, scales and draws y axis for legend
and draws y axis title. Takes in list of objects. Each object 
needs the variable for color.
*/
function drawLegend(data) {

	// set height and width for gradient
	var gradientHeight = 200,
		gradientWidth = 40;

	// create svg for legend
	var thissvg = d3.select("#container")
		.append("svg")
		.attr("class", "forLegend")
		.attr("height", h - margin.top)
		.attr("width", 230)
		.attr("x", w)
		.attr("y", h + 10);

	// set color gradient at right positions
	var legend = d3.select(".forLegend")
		.append("defs")
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
	thissvg.append("rect")
		.attr("width", gradientWidth)
		.attr("height", gradientHeight)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0, 10)");

	// scale y axis
	var y = d3.scale.linear()
		.range([gradientHeight, 0])
		.domain([d3.min(data, function(d) { return d.GDP; }), 
			d3.max(data, function(d) { return d.GDP; })]).nice();

	// create y axis
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");

	// draw y axis at right spot with legend title
	thissvg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + gradientWidth + ", 10)")
		.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 50)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("GDP per capita in $");
};

/* This function creates an interactive map of Europe. It 
zooms and sets the map at the correct angle, loads in data
about the countries, draws borders and fills the countries
with the correct color. It makes countries change color on
mouseclick and calls a function to create the correct bar 
chart. Finally calls functions to create a search function 
and draw the legend. This function takes in data for the bar
chart and data about GDP for countries in Europe, in format
of a list of objects.
*/
function createMap(error, inequalityData, GDPdata, GEOdata) {

	// alert error if necessary
	if (error) {
			alert("Error" + error);
	};

	// define map projection
	var projection = d3.geo.mercator()
		.center([30, 52]) 
		.translate([w / 1.5, h / 2]) 
		.scale([w / 1.6]);

	// define path generator
	var path = d3.geo.path()
		.projection(projection);

	// create SVG with correct width and height
	svg = d3.select("#container")
		.append("svg")
			.attr("class", "forMap")
			.attr("width", w - margin.right)
			.attr("height", h - margin.top);

	// make array with GEOJSON data and countrycodes of countries with inequality data
	var europeData = [];
	GEOdata.features.forEach(function(element) {
		for (let i = 0; i < inequalityData.length; i ++) {
			if (element.properties.iso_a2 == inequalityData[i].countrycode) {
				europeData.push(element);
				europeNames.push(element.properties.iso_a2);
			}
		}
	});

	// set color scaler
	var color = d3.scale.linear()
	.range(["#FFffff", "#000099"])
	.domain([d3.min(GDPdata, function(d) { return d.GDP; }), 
		d3.max(GDPdata, function(d) { return d.GDP; })]);

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// bind data and create one path per GeoJSON feature
	// also fill with correct colors
	svg.selectAll("path")
		.data(GEOdata.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("id", "deselected")
			.attr("class", function(d) {
				if (europeNames.indexOf(d.properties.iso_a2) >= 0) return "active";
				else return "notActive";
			})
			.attr("stroke", "rgba(0, 0, 0, 0.2)")
			.attr("fill", function(d) {
				if (d3.select(this).attr("class") == "active") {
					return color(GDPdata.filter(x => x.countrycode == d.properties.iso_a2)[0].GDP);
				}
				else return "gray";
			})
			.on("mouseover", mapMouseover)
			.on("click", clickAction)			
			.on("mouseout", mapMouseout);

	/* This function displays the countryname and the GDP value when
	hovering over the country. It takes in the GEO data.
	*/
	function mapMouseover(d) {

		// check if country has data to display
		if (d3.select(this).attr("class") == "notActive") return;

		// make tooltip visible and display values
		tooltip.transition()
		.duration(100)
		.style("opacity", .9);
		tooltip.html("Country: <span style='color:red'>" + d.properties.admin 
			+ "</span> <br/>GDP: <span style='color:red'>$" 
			+ GDPdata.filter(x => x.countrycode == d.properties.iso_a2)[0].GDP + "</span>")
			.style("left", (d3.event.pageX - 90) + "px")     
			.style("top", (d3.event.pageY - 77) + "px");
	};

	/* This function changes the colors of clicked on countries
	and calls the function to create the correct bar chart. It 
	takes in the data and calls the function to create the bar 
	chart at the right time. 
	*/
	function clickAction(d) {

		// check if clicked country is in dataset
		if (d3.select(this).attr("class") == "notActive") return;

		// check if country is selected
		if (d3.select(this).attr("id") == "deselected") {

			// fill all countries with correct color
			d3.selectAll(".active")
				.attr("id", "deselected")
				.attr("fill", function(d) { 
					return color(GDPdata.filter(x => x.countrycode == d.properties.iso_a2)[0].GDP); 
				});

			// fill selected country with black
			d3.select(this)
				.attr("id", "selected")
				.attr("fill", "black");

			// draw bar chart with data of selected country
			drawBarchart(inequalityData, d.properties.iso_a2, d.properties.admin, GDPdata);
		}

		// if country is already selected
		else if (d3.select(this).attr("id") == "selected") {

			// deselect country and fill with right GDP color again
			d3.select(this)
				.attr("id", "deselected")
				.attr("fill", function(d) {
					return color(GDPdata.filter(x => x.countrycode == d.properties.iso_a2)[0].GDP);
				});

			// remove chart when no country is selected
			d3.select(".chart").remove();
			d3.select(".titleChart").remove();
			d3.select(".displayValues").remove();
			chartCreated = false;
		};
	};

	/* This function sets opacity of the displayed country name 
	and GDP value to 0. It takes in the GEO data.
	*/
	function mapMouseout(d) {
		tooltip.transition()
			.duration(500)
			.style("opacity", 0);
		};

	// call functions to search for countries and create legend
	searchCountry(europeData, inequalityData, GDPdata);
	drawLegend(GDPdata);
};

/* This function lets you search for countries
in stead of clicking on them. It types ahead and
completes your first letters with the available
data. Finally calls function to create correct 
bar chart. Takes in mapdata about Europe, all 
inequality data, all map data and data about the
GDP per capita. Calls function to create bar chart 
when needed. 
*/
function searchCountry(europeData, inequalityData, GDPdata) {

	var $input = $(".typeahead");

	// put in data to type ahead in form of object
	$input.typeahead({
		source: europeData.map(x => ({id: x.properties.iso_a2, name: x.properties.admin})),
		autoSelect: true
	});

	// function to act upon typed country
	$input.change(function() {

		var current = $input.typeahead("getActive");

		if (current) {

			// if countryname is correct
			if (current.name == $input.val()) {

				// draw bar chart with correct data
				country = europeData.filter(x => x.properties.admin == current.name);
				drawBarchart(inequalityData, country[0].properties.iso_a2, country[0].properties.admin, GDPdata);
			}; 
		};
	});
};

