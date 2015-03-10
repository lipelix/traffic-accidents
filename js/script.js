$(function() {
	var $loading = $('#loader').hide();
	$(document).ajaxStart(function () {$loading.show();}).ajaxStop(function () {$loading.hide();});

	loadData();
});

function loadCsv() {
	$.get('init.php', {function: 'loadCsv'}, function(response) {
		var jsonResponse = JSON.parse(response);
		alert(jsonResponse.msg);
		loadData();
	});
};

function loadData() {
	$.get('init.php', {function: 'getSeverityChartData'}, function(response) {
		var jsonResponse = JSON.parse(response);
		$('#accidents-count').html(jsonResponse.count);
		initSeverityChart(jsonResponse);
	});

	$.get('init.php', {function: 'getDaysChartData'}, function(response) {
		var jsonResponse = JSON.parse(response);
		initDaysChart(jsonResponse);
	});
}

function initDaysChart(response) {
	console.log(response.days);

	$('#days-chart').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: 'Počet nehod ve dnech',
			x: -20 //center
		},
		subtitle: {
			text: 'kecy kecy kecy',
			x: -20
		},
		xAxis: {
			categories: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
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

	console.log(gbData);

	$('#severity-chart').highcharts({
		chart: {
			type: 'pie',
			zoomType: 'xy'
		},
		title: {
			text: 'Vážnost nehod'
		},
		subtitle: {
			text: 'kecy kecy kecy'
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