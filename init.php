<?php

require 'lib/DataController.php';

$result = null;
$dataController = new DataController();

switch ($_GET['function']) {
	case 'getSeverityChartData':
		$result = $dataController->getSeverityChartData();
		echo json_encode($result);
		break;
	case 'getDaysChartData':
		$result = $dataController->getDaysChartData();
		echo json_encode($result);
		break;
	case 'loadCsv':
		$result = $dataController->loadCsv();
		echo $result;
		break;
}


