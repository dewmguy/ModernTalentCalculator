<?php

$file = "builds.txt";

function cleanVar($string) { return preg_replace("/[^a-zA-Z0-9\-_+*.:?!@#$%^&~ ]/","",$string); }

function getBuilds($file) {
 $result = [];
 if(file_exists($file)) {
  $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach($lines as $line) {
   preg_match('/(\d+\/\d+\/\d+)\{(.*?)\}\((.*?)\)\[(.*?)\]/', $line, $matches);
   if($matches) { $result[] = [ 'date' => $matches[1], 'class' => $matches[2],'title' => $matches[3], 'url' => $matches[4] ]; }
  }
 }
 return $result;
}

if(isset($_POST['deleteCode'])) {
 $deleteCode = cleanVar($_POST['deleteCode']);
 $content = file_get_contents($file);
 $content = str_replace(preg_grep("/\[$deleteCode\]/", file($file)), '', $content);
 file_put_contents($file, trim($content));
 echo json_encode(getBuilds($file));
}
else {
 if(isset($_POST['theTitle'], $_POST['theClass'], $_POST['theCode'])) {
  $title = cleanVar($_POST['theTitle']);
  $class = $_POST['theClass'];
  $code = $_POST['theCode'];
  $time = date('n/d/y');

  $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  $exists = false;
  foreach($lines as $line) {
   if(preg_match("/\[$code\]/", $line)) {
    preg_match('/\((.*?)\)/', $line, $matches);
    if($matches) {
     $exists = true;
     echo json_encode(['exists' => true, 'title' => $matches[1]]);
     break;
    }
   }
  }
  if(!$exists) {
   $data = "$time{{$class}}($title)[$code]\n";
   if(file_put_contents($file, $data, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo 'Error writing to file';
   }
   else { echo json_encode(getBuilds($file)); }
  }
 }
 else { echo json_encode(getBuilds($file)); }
}

?>
