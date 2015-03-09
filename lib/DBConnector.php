<?php

class DBConnector {

	public function __construct() {}

	public function getConnection() {
		$host = 'localhost';
		$user = 'root';
		$pass = '';
		$dbName = 'trafficaccidents';

		$mysqli = new mysqli($host, $user, $pass, $dbName);
		if ($mysqli->connect_error) {
			die('Nepodařilo se připojit k MySQL serveru (' . $mysqli->connect_errno . ') '
				. $mysqli->connect_error);
		}

		return $mysqli;
	}

	public function query($sql) {
		$con = $this->getConnection();
		$result = $con->query($sql) or die(mysqli_error($con));
		$con->close();
		return $result;
	}

	public function loadDataToDB($path) {
		$sql = "LOAD DATA LOCAL INFILE '".$path."'
		REPLACE INTO TABLE accidents_gb FIELDS TERMINATED BY ','
		(id,@dummy,@dummy,@dummy,@dummy,@dummy,severity,@dummy,@dummy,date,day_of_week)";

		$mysqli = new mysqli('localhost', 'root', '', 'trafficaccidents');
		if ($mysqli->connect_error) {
			die('Nepodařilo se připojit k MySQL serveru (' . $mysqli->connect_errno . ') '
				. $mysqli->connect_error);
		}

		$result = $mysqli->query($sql) or die(mysqli_error($mysqli));

		return $result;
	}

}