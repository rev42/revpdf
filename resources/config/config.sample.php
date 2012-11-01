<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

// UI theme
// Choices : bootstrap, cerulean, cyborg, default, journal, slate, spacelab, united
$theme = 'default';

// Database
$app['db.config.driver']    = ''; # doctrine supported driver (pdo_mysql, pdo_sqlite, pdo_pgsql, pdo_oci, oci8, ibm_db2, pdo_ibm, pdo_sqlsrv, mysqli)
$app['db.config.dbname']    = ''; # database name
$app['db.config.host']      = ''; # DB hostname
$app['db.config.user']      = ''; # DB username
$app['db.config.password']  = ''; # DB password

// Mailer (see http://silex.sensiolabs.org/doc/providers/swiftmailer.html)
$app['mailer.config.host'] = "";
$app['mailer.config.port'] = "";
$app['mailer.config.username'] = "";
$app['mailer.config.from'] = "";
$app['mailer.config.password'] = "";
$app['mailer.config.encryption'] = '';
$app['mailer.config.auth_mode']  = '';

// Localization
// Default locale
$app['locale_fallback'] = 'fr';
$app['supported_languages'] = array('en', 'fr');

// Path to yui_compressor (if needed)
$app['assetic.filter.yui_compressor.path'] = __DIR__ . '/../java/yuicompressor.jar';

// Enable user security component (user login, user account...) ?
$enable_security = 0;

// Debug log file
$app['debug'] = 1;
$app['log.filepath'] = __DIR__.'/../../log/app.log';

