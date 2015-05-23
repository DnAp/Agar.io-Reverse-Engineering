<?php
$context = null;
if (!empty($_GET['info'])) {
    $url = 'http://m.agar.io/info';
} else {
    $url = 'http://m.agar.io/';
    $context = stream_context_create(array(
        'http' => array(
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded' . PHP_EOL,
            'content' => file_get_contents('php://input'),
        ),
    ));
}

echo file_get_contents($url, false, $context);