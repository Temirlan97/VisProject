var data = null;

var dataFileName = "NCHS_-_Leading_Causes_of_Death__United_States.csv";
var inputCause = "All Causes";
var inputState = null;



d3.csv(dataFileName, function(error, theData){
	if (error) {
		return console.warn(error);
	}
	data = theData;
	update();
});

function update(){
	var selCause = document.getElementById('cause');
	var causeSelected = selCause.options[selCause.selectedIndex].value;
	if(causeSelected != "--"){
		inputCause = causeSelected;
	}
	var selState = document.getElementById('state');
	var stateSelected = selState.options[selState.selectedIndex].value;
	if(stateSelected != "--"){
		inputState = stateSelected;
	}
	linechart(inputCause, inputState);
	if(inputState){
		barchartcause(inputState);
    } else {
    	barchartstate(inputCause);
    }
}

function barchartstate(cause){
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
		if (item.cause == cause){
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

	var y = d3.scaleLinear().range([height-margin.top, margin.bottom]).domain([0, maxCount]);
	var x = d3.scaleBand().domain(typesOfCrimes).range([margin.left, width+margin.left]);


	var barChartWidth = width/arrayData.length - 3;
	chart.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "10px") 
      .text("# of deaths due to " + cause);

	
	chart.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(d3.axisBottom(x));

	chart.append("g")
		.call(d3.axisLeft(y));

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
	        div.html(d.state  + "<br/>"  + d.count + " times")
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


function barchartcause(state){
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
		if (item.state == state){
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


	var y = d3.scaleLinear().range([height-margin.top, margin.bottom]).domain([0, maxCount]);
	var x = d3.scaleBand().domain(typesOfCrimes).range([margin.left, width+margin.left]);

	var barChartWidth = width/arrayData.length - 3;
	
	chart.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "10px") 
      .text("# of deaths 1999-2015");


	chart.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(d3.axisBottom(x));

	chart.append("g")
		.call(d3.axisLeft(y));

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
	        div.html(d.cause  + "<br/>"  + d.count + " times")
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


function linechart(causeOfDeath, state){
	var margin = {top: 50, right: 5, bottom: 50, left: 600};
	var width = 900 - margin.left - margin.right, 
	height = 500 - margin.top - margin.bottom;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".linechart").remove();
	var chart = d3.select("svg").append("g").attr("class", "linechart")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + margin.left+","+margin.top+")");

	var mappedData = data.map(function (d) {
		return {
			year: +d["Year"],
			cause: d["Cause Name"],
			state: d["State"],
			ageAdjRate: +d["Age-adjusted Death Rate"]
	    };
	});

	var neededData = new Array();
	var averageDataAsMap = new Object();
	var minYear = 3000;
	var maxYear = 0;
	for(var i = 0; i < mappedData.length; i++){
		if(mappedData[i].cause == causeOfDeath){
			minYear = minYear < mappedData[i].year ? minYear : mappedData[i].year;
			maxYear = maxYear > mappedData[i].year ? maxYear : mappedData[i].year; 
			if(!averageDataAsMap[mappedData[i].year]){
				averageDataAsMap[mappedData[i].year] = 0;
			}
			averageDataAsMap[mappedData[i].year] += mappedData[i].ageAdjRate/50;			
			if(mappedData[i].state == state){
				neededData.push(mappedData[i]);	
			}
		}
	}
	var averageData = new Array();
	for(key in averageDataAsMap){
		averageData.push({year:key, ageAdjRate:averageDataAsMap[key]});
	}
	var xScale = d3.scaleLinear()
		.range([0, width])
		.domain([ minYear, maxYear]);
	var minY = d3.min(neededData, function(d){return d.ageAdjRate;});
	var minYAverage = d3.min(averageData, function(d){return d.ageAdjRate;});
	minY = minY < minYAverage ? minY : minYAverage;
	var maxY = d3.max(neededData, function(d){return d.ageAdjRate;});
	var maxYAverage = d3.max(averageData, function(d){return d.ageAdjRate;});
	maxY = maxY > maxYAverage ? maxY : maxYAverage;
	
	var yScale = d3.scaleLinear()
		.range([height, 0])
		.domain([minY, maxY]);
	
	var valueLine = d3.line()
		.x(function(d){return xScale(d.year);})
		.y(function(d){return yScale(d.ageAdjRate);});

	if(state){
		chart.append("path")
			.data([neededData])
			.attr("class", "line")
			.attr("d", valueLine)
			.on("mouseover", function(d) {		
		        div.transition()		
		            .duration(200)		
		            .style("opacity", 0.9);	
		        div.html(state + "<br/>"  + causeOfDeath)
		            .style("left", (d3.event.pageX) + "px")		
		            .style("top", (d3.event.pageY - 30) + "px");	
		        })					
		    .on("mouseout", function(d) {		
		        div.transition()		
		            .duration(500)		
		            .style("opacity", 0);	
	         });
	}

	chart.append("path")
		.data([averageData])
		.attr("class", "averageLine")
		.attr("d", valueLine)
		.on("mouseover", function(d) {		
	        div.transition()		
	            .duration(200)		
	            .style("opacity", 0.9);	
	        div.html("Average across states")
	            .style("left", (d3.event.pageX) + "px")		
	            .style("top", (d3.event.pageY - 30) + "px");	
	        })					
	    .on("mouseout", function(d) {		
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);	
         });

	chart.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(d3.axisBottom(xScale));


	chart.append("g")
		.call(d3.axisLeft(yScale));

}