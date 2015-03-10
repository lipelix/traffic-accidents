<?php

include_once 'DBConnector.php';

class DataController {

	public function __construct() {}

	public function getSeverityChartData() {
		$db = new DBConnector();

		$resultFormat = '{"count": 0, "severity": []}';
		$result = json_decode($resultFormat);

		$accidentsCount = $db->query('SELECT COUNT(*) FROM accidents_gb')->fetch_row()[0];
		$result->count = $accidentsCount;

		$severityCountResult = $db->query('SELECT severity,COUNT(*) FROM accidents_gb GROUP BY severity');
		while($row = $severityCountResult->fetch_array()){
			$severityItem = array("severity" => $row[0], "count" => $row[1], "percent" => $row[1] / $accidentsCount * 100);
			array_push($result->severity, (object) $severityItem);
		}

		return $result;
	}

	public function getDaysChartData() {
		$db = new DBConnector();

		$resultFormat = '{"days": []}';
		$result = json_decode($resultFormat);

		$daysCountResult = $db->query('SELECT day_of_week,COUNT(*) FROM accidents_gb GROUP BY day_of_week');
		while($row = $daysCountResult->fetch_array()){
			if ($row[0] != 0)
				array_push($result->days, intval($row[1]));
		}

		return $result;
	}

	public function loadCsv() {
		$db = new DBConnector();
		$db->loadDataToDB('data/Accidents0513.csv');
		return '{"status":"ok", "msg":"Data succesfully created"}';
	}


} 