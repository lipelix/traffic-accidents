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
		$sqlTable = "DROP TABLE IF EXISTS accidents_gb;
			CREATE TABLE accidents_gb ( id VARCHAR(30) PRIMARY KEY, severity VARCHAR(30) NOT NULL,number_of_vehicles VARCHAR(30) NOT NULL,number_of_casualties VARCHAR(30) NOT NULL, accident_date DATE NOT NULL, day_of_week VARCHAR(50), lng FLOAT( 10, 6 ) NOT NULL, lat FLOAT( 10, 6 ) NOT NULL );";

		$sql = "LOAD DATA LOCAL INFILE '".$path."'
		REPLACE INTO TABLE accidents_gb FIELDS TERMINATED BY ','
		(id,@dummy,@dummy,lng,lat,@dummy,severity,number_of_vehicles,number_of_casualties,@date_time_variable,day_of_week)
		SET accident_date = STR_TO_DATE(@date_time_variable, '%d/%m/%Y')";

		$mysqli = new mysqli('localhost', 'root', '', 'trafficaccidents');
		if ($mysqli->connect_error) {
			die('Nepodařilo se připojit k MySQL serveru (' . $mysqli->connect_errno . ') '
				. $mysqli->connect_error);
		}

		$mysqli->multi_query($sqlTable) or die(mysqli_error($mysqli));
		do { $mysqli->use_result(); } while($mysqli->next_result()); // handle "Commands out of sync;" error
		$result = $mysqli->query($sql) or die(mysqli_error($mysqli));
		do { $mysqli->use_result(); } while($mysqli->next_result()); // handle "Commands out of sync;" error

		return $result;
	}

}