<?
$file = $_POST['name'].".txt";
$i = 0;
while(file_exists($file)){
    $file = $_POST['name']."(".$i.").txt";
    $i++;
}

if( !is_file($file)) {

    $fp = fopen($file, "w"); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл

    fwrite($fp, $_POST['arr']); // записываем json в наш файл

    fclose($fp); // закрываем файл
}
?>