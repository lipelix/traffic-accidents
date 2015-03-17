<?php
 
// Include Composer autoloader if not already done.
include 'vendor/autoload.php';
 
// Parse pdf file and build necessary objects.
// $parser = new \Smalot\PdfParser\Parser();
// $pdf    = $parser->parseFile('pdfs/2011_12_informace.pdf');
// $parser = new \Smalot\PdfParser\Parser(); 
// $text = $pdf->getText();
// $text = substr($text, 60, 1000); 
// echo $text;

	$addr = ("pdfs/");
	$pdfs = array_merge(glob($addr . "*.pdf"));
	$num = count(glob($addr . "*.pdf"));
	//echo"Lucky počet";
	//echo"$num";
	$pom_pocet = 0;
	$poc_souboru = $num;
	$text="";

	for($z=0;$z<$num;$z++)
	{
		$pdf = $pdfs[$z];
		$odkaz = iconv("WINDOWS-1250", "UTF-8", $pdf);
		$pom = explode("/",$odkaz);
		$pole_soubor_odkaz[$z] = "/".$odkaz;
		$parser = new \Smalot\PdfParser\Parser();
		echo $odkaz;
		$pdf    = $parser->parseFile($odkaz);
		$text .= substr($pdf->getText(), 60, 1000);;
		$text .="|||||";
	}
	echo $text;
	
?>