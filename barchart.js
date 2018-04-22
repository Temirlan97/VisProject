var filterObject = null;
var data = null;

d3.csv("NCHS_-_Leading_Causes_of_Death__United_States.csv", function(error, theData){
	if (error) {
		return console.warn(error);
	}
	data = theData;
    barchartcause();
    barchartstate();
});

function update(){
	// draw complete new bar chart 
    barchartstate();
    barchartcause();
}

function barchartcause(){
	var margin = {top: 5, right: 5, bottom: 25, left: 20};
	var width = 300 - margin.left - margin.right, 
	height = 300 - margin.top - margin.bottom;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".barchart").remove();
	var chart = d3.select("svg").append("g").attr("class", "barchart")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "barchart")
		.attr("transform", "translate(" + margin.left+","+margin.top+")");

	var neededData = data.map(function (d) {
		return {
			cause: d["Cause Name"],
			state: d["State"],
			deaths: +d["Deaths"],
            age: +d["Age-adjusted Death Rate"],
            year: +d["Year"]
	    };
	});


	var deathsCountMap = new Object();
	var codeToDescription = new Object();
	var maxCount = 0;
	for (var i = 0; i < neededData.length; i++){
		var item = neededData[i];
		if (item.state == "California"){
            codeToDescription[item.state] = item.cause;
            if (deathsCountMap[item.cause]){
				deathsCountMap[item.cause] += item.deaths;
			} else {
				deathsCountMap[item.cause] = item.deaths;
			}
			deathsCountMap[item.cause] += item.deaths;
            maxCount = maxCount < deathsCountMap[item.cause] ? deathsCountMap[item.cause] : maxCount;
        }
	}
	var arrayData = new Array();
	for(key in deathsCountMap){
		if(key && deathsCountMap[key]){
			arrayData.push({cause: key, count: deathsCountMap[key]});
		}
	}
	arrayData.sort(function(a,b){return a.count - b.count;});
	if (arrayData.length > 10){
		arrayData = arrayData.slice(arrayData.length - 10, arrayData.length);
	}
	var typesOfCrimes = new Array();
	for(var i = 0; i < arrayData.length; i++){
		typesOfCrimes.push(arrayData[i].cause);
	}


	var y = d3.scale.linear().range([height-margin.top, margin.bottom]).domain([0, maxCount]);
	var x = d3.scale.ordinal().domain(typesOfCrimes).rangeBands([margin.left, width+margin.left]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var barChartWidth = width/arrayData.length - 3;
	chart.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "10px") 
      .text("Most frequent crimes by people from out of town");

	chart.append("g")
		.attr("class", "axis axis--x")
		.style("font-size", "8px")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("transform", "translate("+ width + ","+ 3*margin.bottom/4 +")")
		.attr("text-anchor", "end")
		.text("Crime code");

	chart.append("g")
		.attr("class", "axis axis--y")
		.style("font-size", "8px")
		.attr("transform", "translate(" + margin.left + "," + margin.top +")")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("dy", "0.75em")
		.attr("text-anchor", "end")
		.text("# of Crimes");

	var bar = chart.selectAll(".barHisto").data(arrayData).enter().append("g").
		attr("transform", function(d, i) {return "translate(" + x(d.cause) +",0)";});

	bar.append("rect")
		.attr("class", "barHisto")
		.attr("fill", "blue")
		.attr("y", function(d) {return y(d.count);})
		.attr("height", function(d) {return height - y(d.count);})
		.attr("width", barChartWidth)
		.on("mouseover", function(d) {
			d3.select(this).attr("fill", "red");		
	        div.transition()		
	            .duration(200)		
	            .style("opacity", 0.9);	
	        div.html(codeToDescription[d.crime]  + "<br/>"  + d.count + " times")
	            .style("left", (d3.event.pageX) + "px")		
	            .style("top", (d3.event.pageY - 30) + "px");	
	        })					
	    .on("mouseout", function(d) {
			d3.select(this).attr("fill", "blue");		
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);	
         });
}

function barchartstate(){
	var margin = {top: 5, right: 5, bottom: 25, left: 20};
	var width = 300 - margin.left - margin.right, 
	height = 300 - margin.top - margin.bottom;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".barchart").remove();
	var chart = d3.select("svg").append("g").attr("class", "barchart")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "barchart")
		.attr("transform", "translate(" + margin.left+","+margin.top+")");

	var neededData = data.map(function (d) {
		return {
			cause: d["Cause Name"],
			state: d["State"],
			deaths: +d["Deaths"],
            age: +d["Age-adjusted Death Rate"],
            year: +d["Year"]
	    };
	});


	var deathsCountMap = new Object();
	var codeToDescription = new Object();
	var maxCount = 0;
	for (var i = 0; i < neededData.length; i++){
		var item = neededData[i];
		if (item.cause == "All Causes"){
            codeToDescription[item.state] = item.cause;
            if (deathsCountMap[item.state]){
				deathsCountMap[item.state] += item.deaths;
			} else {
				deathsCountMap[item.state] = item.deaths;
			}
			deathsCountMap[item.state] += item.deaths;
            maxCount = maxCount < deathsCountMap[item.state] ? deathsCountMap[item.state] : maxCount;
        }
	}
	var arrayData = new Array();
	for(key in deathsCountMap){
		if(key && deathsCountMap[key]){
			arrayData.push({state: key, count: deathsCountMap[key]});
		}
	}
	arrayData.sort(function(a,b){return a.count - b.count;});
	if (arrayData.length > 10){
		arrayData = arrayData.slice(arrayData.length - 10, arrayData.length);
	}
	var typesOfCrimes = new Array();
	for(var i = 0; i < arrayData.length; i++){
		typesOfCrimes.push(arrayData[i].state);
	}


	var y = d3.scale.linear().range([height-margin.top, margin.bottom]).domain([0, maxCount]);
	var x = d3.scale.ordinal().domain(typesOfCrimes).rangeBands([margin.left, width+margin.left]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var barChartWidth = width/arrayData.length - 3;
	chart.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "10px") 
      .text("Most frequent crimes by people from out of town");

	chart.append("g")
		.attr("class", "axis axis--x")
		.style("font-size", "8px")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("transform", "translate("+ width + ","+ 3*margin.bottom/4 +")")
		.attr("text-anchor", "end")
		.text("Crime code");

	chart.append("g")
		.attr("class", "axis axis--y")
		.style("font-size", "8px")
		.attr("transform", "translate(" + margin.left + "," + margin.top +")")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("dy", "0.75em")
		.attr("text-anchor", "end")
		.text("# of Crimes");

	var bar = chart.selectAll(".barHisto").data(arrayData).enter().append("g").
		attr("transform", function(d, i) {return "translate(" + x(d.state) +",0)";});

	bar.append("rect")
		.attr("class", "barHisto")
		.attr("fill", "blue")
		.attr("y", function(d) {return y(d.count);})
		.attr("height", function(d) {return height - y(d.count);})
		.attr("width", barChartWidth)
		.on("mouseover", function(d) {
			d3.select(this).attr("fill", "red");		
	        div.transition()		
	            .duration(200)		
	            .style("opacity", 0.9);	
	        div.html(codeToDescription[d.crime]  + "<br/>"  + d.count + " times")
	            .style("left", (d3.event.pageX) + "px")		
	            .style("top", (d3.event.pageY - 30) + "px");	
	        })					
	    .on("mouseout", function(d) {
			d3.select(this).attr("fill", "blue");		
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);	
         });
}




