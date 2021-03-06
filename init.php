<?php

require 'lib/DataController.php';

$result = null;
$dataController = new DataController();

switch ($_GET['function']) {
	case 'getSeverityChartData':
		$result = $dataController->getSeverityChartData($_GET['year']);
		echo json_encode($result);
		break;
	case 'getDaysChartData':
		$result = $dataController->getDaysChartData($_GET['year']);
		echo json_encode($result);
		break;
	case 'getHeatmapData':
		$result = $dataController->getHeatmapData($_GET['year']);
		echo json_encode($result);
		break;
	case 'loadCsv':
		$result = $dataController->loadCsv();
		echo $result;
		break;

	case 'getCarsCountChartData':
		$result = $dataController->getCarCountChartData($_GET['year']);
		echo json_encode($result);
		break;
}


