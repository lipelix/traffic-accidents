$(function () {
	var $loading = $('#loader');
	$(document).ajaxStart(function () {
		$loading.show();
	}).ajaxStop(function () {
		$loading.hide();
	});

	loadData();
	showHeatmap();
});

function loadCsv() {
	$.get('init.php', {function: 'loadCsv'}, function (response) {
		var jsonResponse = JSON.parse(response);
		alert(jsonResponse.msg);
		loadData();
	});
};

function loadData() {
	$.get('init.php', {function: 'getSeverityChartData', year: $("#year-selector").val()}, function (response) {
		var jsonResponse = JSON.parse(response);
		$('#accidents-count').html(jsonResponse.count);
		initSeverityChart(jsonResponse);
	});

	$.get('init.php', {function: 'getCarsCountChartData', year: $("#year-selector").val()}, function (response) {
		if (response.indexOf("Unknown column") == -1) {
			var jsonResponse = JSON.parse(response);
			initCarsCountChart(jsonResponse);
		}
	});

	$.get('init.php', {function: 'getDaysChartData', year: $("#year-selector").val()}, function (response) {
		var jsonResponse = JSON.parse(response);
		initDaysChart(jsonResponse);
	});
}

function initDaysChart(response) {
	$('#days-chart').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: 'Počet nehod ve dnech',
			x: -20 //center
		},
		subtitle: {
			text: '',
			x: -20
		},
		xAxis: {
			categories: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
		},
		yAxis: {
			title: {
				text: 'Počet nehod'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: [{
			name: 'GB',
			data: response.days
		}]
	});
}

function initCarsCountChart(response) {
	var gbData = [];
	var czData = [];

	for (var i = 0; i < response.carsCount.length; i++) {
		gbData.push([response.carsCount[i].carsCount, parseInt(response.carsCount[i].count)]);
	}

	$('#carsCount-chart').highcharts({
		chart: {
			type: 'pie',
			zoomType: 'xy'
		},
		title: {
			text: 'Počet zúčastněných automobilů'
		},
		subtitle: {
			text: ''
		},
		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %'
				}
			}
		},
		series: [{
			name: 'Počet nehod',
			color: 'rgba(223, 83, 83, .5)',
			data: gbData
		}]
	});
}

function initSeverityChart(response) {
	var gbData = [];
	var czData = [];

	for (var i = 0; i < response.severity.length; i++) {
		gbData.push([response.severity[i].severity, parseInt(response.severity[i].count)]);
	}

	$('#severity-chart').highcharts({
		chart: {
			type: 'pie',
			zoomType: 'xy'
		},
		title: {
			text: 'Vážnost nehod'
		},
		subtitle: {
			text: ''
		},
		tooltip: {
			pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %'
				}
			}
		},
		series: [{
			name: 'Počet nehod',
			color: 'rgba(223, 83, 83, .5)',
			data: gbData
		}]
	});
}

var heatmapData = null;
var heatmap = null;

function showHeatmap() {
	$.get('init.php', {function: 'getHeatmapData', year: $("#year-selector").val()}, function (response) {
		var jsonResponse = JSON.parse(response);
		heatmapData = new google.maps.MVCArray();

		for (var i = 0; i < jsonResponse.heatmap.length; i++) {
			heatmapData.push(new google.maps.LatLng(jsonResponse.heatmap[i][0], jsonResponse.heatmap[i][1]));
		};

		heatmap.set('data', heatmapData);
		$('#map-accidents-count').html(jsonResponse.heatmap.length);
	});

	loadData();
}

function increaseRadius() {
	heatmap.set('radius', heatmap.get('radius') + 2);
}

function decreaseRadius() {
	heatmap.set('radius', heatmap.get('radius') - 2);
}

function initialize() {
	var london = new google.maps.LatLng(51.489096, -0.191170);

	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: london,
		zoom: 7,
		//mapTypeId: google.maps.MapTypeId.SATELLITE
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	heatmapData = new google.maps.MVCArray();

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: heatmapData
	});

	heatmap.set('radius', 10);
	heatmap.set('opacity', 0.8);
	var previous_zoom = 7;
	heatmap.setMap(map);
	google.maps.event.addListener(map, 'zoom_changed', function() {
   				 var zoomLevel = map.getZoom();
   				  var changeRadius = zoomLevel;
   				  console.log(heatmap.get('radius'),zoomLevel,previous_zoom);
   				 //console.log(zoomLevel/3);
   				 //console.log(zoomLevel*Math.pow(2,(zoomLevel/3)));
   				 //var changeRadius = zoomLevel*Math.pow(2,Math.ceil(zoomLevel/3));
   				 if(zoomLevel > previous_zoom){
   				 heatmap.set('radius', heatmap.get('radius') + (4*zoomLevel)-4);
   				}
   				else{
   					if (map.getZoom() < 7){
      			 alert("You cannot zoom out any further");
			       map.setZoom(7);
			       heatmap.set('radius', 10);
			    	}
   					else{
   						heatmap.set('radius', heatmap.get('radius') - (4*zoomLevel));
   					}
   				 
   				}
   				previous_zoom = map.getZoom();
   				console.log(heatmap.get('radius'),zoomLevel,previous_zoom);

  			});
}

google.maps.event.addDomListener(window, 'load', initialize);



