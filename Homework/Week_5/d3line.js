/* 
Name: Roos Greven
11436700
Homework week 5: make an interactive line graph with D3.
*/

// load full page before loading data
window.onload = function() {

// load json data
	d3.json("data2010_2011.json", function(error, data) {

		// when there is an error, throw error
		if (error) {
			alert("error" + error);
		};

		// call function to draw scatterplot
		console.log(data);
			
	});
};