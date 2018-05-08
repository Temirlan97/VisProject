var data = null;

var dataFileName = "NCHS_-_Leading_Causes_of_Death__United_States.csv";
var inputCause = "All Causes";
var inputState = "United States";



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
	if(causeSelected == "--"){
		inputCause = "All Causes";
	} else {
		inputCause = causeSelected;
	}
	var selState = document.getElementById('state');
	var stateSelected = selState.options[selState.selectedIndex].value;
	if(stateSelected == "--"){
		inputState = "United States";
	} else {
		inputState = stateSelected;
	}
	setByFilter = true;
	linechart(inputCause, inputState);
	barchartcause(inputState);
    barchartstate(inputCause);
}

function barchartstate(cause){
	var margin = {top: 15, right: 5, bottom: 25, left: 60};
	var width = 280, 
	height = 180;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".barchartstates").remove();
	var chart = d3.select("#svgbarcharts").append("g").attr("class", "barchartstates")
		.attr("width", width)
		.attr("height", height)
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
	var maxCount = 0;
	for (var i = 0; i < neededData.length; i++){
		var item = neededData[i];
		if (item.cause == cause && item.state != "United States"){
            if (deathsCountMap[item.state]){
				deathsCountMap[item.state] += item.deaths;
			} else {
				deathsCountMap[item.state] = item.deaths;
			}
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

	var y = d3.scaleLinear().range([height, 0]).domain([0, maxCount]);
	var x = d3.scaleBand().domain(typesOfCrimes).range([0, width]);


	var barChartWidth = width/arrayData.length - 3;
	chart.append("text")
      .attr("x", (width / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "12px") 
      .text("# of deaths across states due to " + cause);

	
	chart.append("g")
		.attr("transform", "translate(0,"+ (height)+")")
		.call(d3.axisBottom(x))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)" );

	chart.append("g")
		.call(d3.axisLeft(y));

	var bar = chart.selectAll(".barHisto").data(arrayData).enter().append("g").
		attr("transform", function(d, i) {return "translate(" + x(d.state) +",0)";});

	bar.append("rect")
		.attr("class", "barHisto")
		.attr("fill", "#9932CC")
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
			d3.select(this).attr("fill", "#9932CC");		
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);	
         })
	    .on("click", function(d){
	    	inputState = d.state;
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);
	        d3.select('#state').property('value', inputState);
	    	update();
	    });
}


function barchartcause(state){
	var margin = {top: 255, right: 5, bottom: 25, left: 60};
	var width = 280, 
	height = 180;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".barchartcauses").remove();
	var chart = d3.select("#svgbarcharts").append("g").attr("class", "barchartcauses")
		.attr("width", width)
		.attr("height", height)
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
	var maxCount = 0;
	for (var i = 0; i < neededData.length; i++){
		var item = neededData[i];
		if (item.state == state && item.cause != "All Causes"){
            if (deathsCountMap[item.cause]){
				deathsCountMap[item.cause] += item.deaths;
			} else {
				deathsCountMap[item.cause] = item.deaths;
			}
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
	var y = d3.scaleLinear().range([height, 0]).domain([0, maxCount]);
	var x = d3.scaleBand().domain(typesOfCrimes).range([0, width]);

	var barChartWidth = width/arrayData.length - 3;
	
	chart.append("text")
      .attr("x", (width / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "15px") 
      .text("Death causes in " + state);


	chart.append("g")
		.attr("transform", "translate(0,"+(height)+")")
		.call(d3.axisBottom(x))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)" );

	chart.append("g")
		.call(d3.axisLeft(y));

	var bar = chart.selectAll(".barHisto").data(arrayData).enter().append("g").
		attr("transform", function(d, i) {return "translate(" + x(d.cause) +",0)";});

	bar.append("rect")
		.attr("class", "barHisto")
		.attr("fill", "#D2691E")
		.attr("y", function(d) {return y(d.count);})
		.attr("height", function(d) { return height - y(d.count);})
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
			d3.select(this).attr("fill", "#D2691E");		
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);	
         })
	    .on("click", function(d){
	    	inputCause = d.cause;
	        div.transition()		
	            .duration(500)		
	            .style("opacity", 0);
	        d3.select('#cause').property('value', inputCause);
	    	update();
	    });
}


function linechart(causeOfDeath, state){
	var margin = {top: 50, right: 5, bottom: 50, left: 500};
	var width = 400, 
	height = 400;

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select(".linechart").remove();
	var chart = d3.select("#svgcontent").append("g").attr("class", "linechart")
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