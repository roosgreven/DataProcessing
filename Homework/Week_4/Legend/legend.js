window.onload = function() {
	createLegend();
};

var createLegend = function() {

	// create variables for width, height and size of blocks
	var width = 360;
	var height = 360;
	var radius = Math.min(width, height) / 2;
	var legendRectSize  = 15;
	var legendSpacing = 6;

	// ordinal scaler to set colors
	var color = d3.scale.ordinal()
	.domain(["0 < 1", "1 < 2", "2 < 3", "3 < 4", "4 < 5"])
	.range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

	// add an svg for the legend
	var svg = d3.select(".chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(50, 50)");

	svg.append("text")
		.attr("x", -2 * legendRectSize + legendRectSize + legendSpacing)
		.attr("y", -40)
		.text("std. dev.");

	// add space for legend and set it at the right spot
	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			var height = legendRectSize + legendSpacing;
			var offset =  height * color.domain().length / 2 - 30;
			var horz = -2 * legendRectSize;
			var vert = i * height - offset;
			return "translate(" + horz + "," + vert + ")"; });

	// add rectangles for color
	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", color)
		.style("stroke", color);

	

	// add the text per block
	legend.append("text")
		.attr("x", legendRectSize + legendSpacing)
		.attr("y", legendRectSize - legendSpacing)
		.text(function(d) { return d; });
	
}