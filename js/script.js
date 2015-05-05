$(function () {
	var $loading = $('#loader').hide();
	$(document).ajaxStart(function () {
		$loading.show();
	}).ajaxStop(function () {
		$loading.hide();
	});

	loadData();
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

	heatmap.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);

