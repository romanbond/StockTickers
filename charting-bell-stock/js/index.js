/* Created by Jason Rametta*/
var stocks = ["BCE.TO"/*,"RCI-B.TO","QBR-B.TO","T.TO", "SJR-B.TO"*/];
var data = [];

/* Setup chart then get data */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(GetStockData(stocks));

/* Loops through stocks array and gets json data from yahoo finance */
function GetStockData(stocks) {
	for(var i=0; i<stocks.length; i++)
		jsonp(new Stock(stocks[i]).generateQuery());
}

/* Stock prototype for creating yahoo queries for historical stock data for the past 1 year */
function Stock(ticker) {
	this.dates = ["",""];
	this.base_url = "https://query.yahooapis.com/v1/public/yql?q=";
	this.query = function() {
		this.generateDates();
		return "select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ ticker +"%22%20and%20startDate%20%3D%20%22"+ this.dates[0].toISOString().substring(0, 10) +"%22%20and%20endDate%20%3D%20%22"+ this.dates[1].toISOString().substring(0, 10) +"%22%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=pushData";
	};
	this.generateDates = function() {
		this.dates[1] = new Date();
		this.dates[0] = new Date(this.dates[1].getFullYear()-1, this.dates[1].getMonth(), this.dates[1].getDate());
	};
	this.generateQuery = function() {
		return this.base_url + this.query();
	};
}

/* Jsonp ajax call, compatible with sharepoint2010 and ie8+ */
function jsonp(query) {
	var script = document.createElement('script');
	script.src = query;
	document.getElementsByTagName('head')[0].appendChild(script);
}

/* Callback function for jsonp requests */
function pushData(response) {
	data.push(response);
	if(data.length == stocks.length)
		drawChart(data);
}

function drawChart(charts) {
	var allSeries = [['Date']];
	
	charts.map(function(chart) {
		allSeries = modifySeries(allSeries, chart);
	});
	
	var data = google.visualization.arrayToDataTable(allSeries);

	var options = {
		title: 'Bell Canada Stock - 1 Year Trend',
		curveType: 'function',
		vAxis: {title: 'Price'},
		hAxis: { textPosition: 'none', direction: -1 },
		legend: { position: 'bottom' }
	};

	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

	chart.draw(data, options);
}

function modifySeries(allSeries, cStock) {
	allSeries[0].push(cStock.query.results.quote[0].Symbol);
	if(allSeries[1] == undefined){
		//the first response
		var first = cStock.query.results.quote.map(function(arr) {
			return [arr.Date, parseFloat(arr.Close)];
		});
		
		first.map(function(arr) {
			allSeries.push(arr);
		});
	} else {
		//any response after the first response
		var notFirst = cStock.query.results.quote.map(function(arr) {
			return parseFloat(arr.Close);
		});
		//merge arrays
		for(var i=1; i<allSeries.length; i++)
			allSeries[i].push(notFirst[i-1]);
	}
	return allSeries;
}