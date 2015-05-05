<?php

include_once 'DBConnector.php';

class DataController {

	const FATAL = 'smrtelná';
	const SLIGHT = 'lehká';
	const SERIOUS = 'vážná';

	public function __construct() {}

	public function getSeverityChartData($year) {
		$db = new DBConnector();

		$resultFormat = '{"count": 0, "severity": []}';
		$result = json_decode($resultFormat);

		$accidentsCount = $db->query('SELECT COUNT(*) FROM accidents_gb')->fetch_row()[0];
		$result->count = $accidentsCount;

		$severityCountResult = $db->query('SELECT severity,COUNT(*) FROM accidents_gb  WHERE YEAR(accident_date) = '.$year.' GROUP BY severity');
		while($row = $severityCountResult->fetch_array()){
			if ($row[0] == 0) continue;

			switch ($row[0]) {
				case 1:
					$row[0] = DataController::FATAL;
					break;
				case 2:
					$row[0] = DataController::SERIOUS;
					break;
				case 3:
					$row[0] = DataController::SLIGHT;
					break;
			}

			$severityItem = array("severity" => $row[0], "count" => $row[1], "percent" => $row[1] / $accidentsCount * 100);
			array_push($result->severity, (object) $severityItem);

		}

		return $result;
	}

	public function getCarCountChartData($year) {
		$db = new DBConnector();

		$resultFormat = '{"count": 0, "carsCount": []}';
		$result = json_decode($resultFormat);

		$carsCount = $db->query('SELECT COUNT(*) FROM accidents_gb')->fetch_row()[0];
		$result->count = $carsCount;

		$carsCountResult = $db->query('SELECT number_of_vehicles,COUNT(*) FROM accidents_gb  WHERE YEAR(accident_date) = '.$year.' GROUP BY number_of_vehicles');

		while($row = $carsCountResult->fetch_array()){

			$carsItem = array("carsCount" => $row[0], "count" => $row[1], "percent" => $row[1] / $carsCount * 100);
			array_push($result->carsCount, (object) $carsItem);

		}

		return $result;
	}

	public function getDaysChartData($year) {
		$db = new DBConnector();

		$resultFormat = '{"days": []}';
		$result = json_decode($resultFormat);

		$daysCountResult = $db->query('SELECT day_of_week,COUNT(*) FROM accidents_gb WHERE YEAR(accident_date) = '.$year.' GROUP BY day_of_week');
		while($row = $daysCountResult->fetch_array()){
			if ($row[0] != 0)
				array_push($result->days, intval($row[1]));
		}

		return $result;
	}

	public function getHeatmapData($year) {
		$db = new DBConnector();

		$resultFormat = '{"heatmap": []}';
		$result = json_decode($resultFormat);

		$latLongResult = $db->query('SELECT lat, lng FROM accidents_gb WHERE YEAR(accident_date) = '.$year);
		while($row = $latLongResult->fetch_array()){
			array_push($result->heatmap, array($row[0], $row[1]));
		}

		return $result;
	}

	public function loadCsv() {
		$db = new DBConnector();
		$db->loadDataToDB('data/Accidents0513.csv');
		return '{"status":"ok", "msg":"Data succesfully created"}';
	}


} 