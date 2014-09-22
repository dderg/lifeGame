<?
$file = $_POST['name'].".txt";
$name = $_POST['name'];
$i = 0;
while(file_exists($file)){
    $file = $_POST['name']."(".$i.").txt";
    $name = $_POST['name']."(".$i.")";
    $i++;
}

if( !is_file($file)) {

    $fp = fopen($file, "w"); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл

    fwrite($fp, $_POST['arr']); // записываем json в наш файл

    fclose($fp); // закрываем файл
}
file_put_contents('list.txt',$name.',',FILE_APPEND);
echo $name;
?>