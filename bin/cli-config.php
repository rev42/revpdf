<?php
$app = require __DIR__.'/../src/app.php';

$helperSet = new \Symfony\Component\Console\Helper\HelperSet(
    array(
         'db' => new \Doctrine\DBAL\Tools\Console\Helper\ConnectionHelper($app['db']),
    )
);

