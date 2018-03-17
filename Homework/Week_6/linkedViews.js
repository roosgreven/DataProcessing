/* 
Name: Roos Greven
11436700
Homework week 6: linked views with d3.
Mijn plan was eerst om de scatterplot en de map te linken.
Door op een land op een van de twee visualisaties te klikken, 
wordt het land in de andere visualisatie ook gehighlight en worden
in het midden de waardes van uit de scatterplot laten zien. Ik kreeg echter feedback
dat hierbij de map niet echt toegevoegde waarde heeft, dus ik wil nu een barchart 
laten verschijnen bij het klikken op een plek op de kaart. Vandaar dat ik nog niet 
zo ver ben (heb alles behalve de kaart weer verwijderd).
*/

window.onload = function() {
	createPlot();
};

var color;

function createPlot() {


	// load in datasets with queue
	queue()
		.defer(d3.json, 'population17.json')
		.defer(d3.json, 'dataEurope.json')
		.await(createMap);
	
};

function createMap(error, population, scatterData) {

	//Width and height
	var w = 600;
	var h = 400;

	//Define map projection
	var projection = d3.geo.mercator() // use a standard projection
	// projection plugin
		.center([ 13, 52 ]) // centrate centre with lat (left and right) and long (up and down)
		.translate([ w/2, h/2 ]) // centrate imagine in svg
		.scale([ w/2 ]); // zoom 

	//Define path generator
	var path = d3.geo.path()
		.projection(projection);

	//Create SVG
	var svg = d3.select("#container")
		.append("svg")
			.attr("width", w)
			.attr("height", h);

	//Load in GeoJSON data
	d3.json("https://raw.githubusercontent.com/openspending/subsidystories.eu/master/app/data/ne_50m_admin_0_countries_simplified.json", 
		function(error, data) {

		var allCountries = [];
		var europeData = [];

		for (let i = 0; i < data.features.length; i++) {
			allCountries.push(data.features[i].properties.admin);
		};

		data.features.forEach(function(element) {
			for (let i = 0; i < scatterData.length; i ++) {
				if (element.properties.admin == scatterData[i].country) {
					europeData.push(element)
				}
			}
		});

		//Bind data and create one path per GeoJSON feature
		svg.selectAll("path")
			.data(europeData)
			.enter()
			.append("path")
				.attr("d", path)
				.attr("class", "countries")
				.attr("id", "deselected")
				.attr("stroke", "rgba(8, 81, 156, 0.2)")
				.attr("fill", "rgba(8, 81, 156, 0.6)")
				.on("click", function(d) {
					if (d3.select(this).attr("id") == "deselected") {
						d3.selectAll(".countries")
							.attr("id", "deselected")
							.attr("fill", "rgba(8, 81, 156, 0.6)")
						d3.select(this)
							.attr("id", "selected")
							.attr("fill", "black");
					}
					else if (d3.select(this).attr("id") == "selected") {
						d3.select(this)
							.attr("id", "deselected")
							.attr("fill", "rgba(8, 81, 156, 0.6)")
					}
				});

		
	});

	
		
}