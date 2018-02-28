window.onload = function() {
	createLegend();
};

var createLegend = function() {

	var width = 360;
	var height = 360;
	var radius = Math.min(width, height) / 2;
	var donutWidth = 75;
	var legendRectSize  = 18;
	var legendSpacing = 4;

	var color = d3.scale.ordinal()
	.domain(["Licht", "Donkerder", "Donker"])
	.range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

	var svg = d3.select(".chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(50, 50)");

	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			var height = legendRectSize + legendSpacing;
			var offset =  height * color.domain().length / 2;
			var horz = -2 * legendRectSize;
			var vert = i * height - offset;
			return "translate(" + horz + "," + vert + ")"; });

	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", color)
		.style("stroke", color);

	legend.append("text")
		.attr("x", legendRectSize + legendSpacing)
		.attr("y", legendRectSize - legendSpacing)
		.text(function(d) { return d; });
	
}