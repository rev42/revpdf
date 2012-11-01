<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

// this check prevents access to debug front controllers that are deployed by accident to production servers.
// feel free to remove this, extend it, or make something more sophisticated.
if (!in_array(
    @$_SERVER['REMOTE_ADDR'],
    array(
        '::1',
        '127.0.0.1',
        '78.242.204.109',
    )
)) {
    header('HTTP/1.0 403 Forbidden');
    exit('You are not allowed to access this file. Check '.basename(__FILE__).' for more information.');
}

// Display PHP errors on screen
ini_set('display_errors', 1);
// Report all PHP errors
error_reporting(-1);

$debug = 1;

$app = require __DIR__.'/../src/app.php';

require __DIR__.'/../src/controllers.php';

$app->run();

