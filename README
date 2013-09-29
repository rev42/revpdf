RevPDF (Graphical PDF generation tool for PHP)
=================================================

This software has been developed from Silex-Kitchen-Edition (MIT Licence) and 
then customized to be RevPDF.


Installation
------------

* Make sure you meet the requirements
    * PHP 5.3.3 (php_intl)
    * Intl PHP Extension (http://www.php.net/manual/en/book.intl.php)

* Run the following commands & actions:
(If you're not running Apache HTTP Server, please see your webserver documentation)

    * Enable mod_rewrite
    * Create a new virtualhost (http://httpd.apache.org/docs/2.2/en/vhosts/examples.html)
    * Make redirections like in web/.htaccess file


For LINUX/MAC users:

    unzip the archive
    cd PATH/TO/YOUR/APP
    curl -s http://getcomposer.org/installer | php
    php composer.phar install

* Rename resources/config/config.sample.php into resources/config/config.php
* Adapt database settings in resources/config/config.php file

     chmod +x bin/console
    ./bin/console revpdf:application:install --create_tables=[yes|no] --import_samples=[no|yes]


For WINDOWS users:

    unzip the archive
    cd PATH/TO/YOUR/APP
    PATH_TO_PHP.EXE\php.exe -r "eval('?>'.file_get_contents('http://getcomposer.org/installer'));"
    PATH_TO_PHP.EXE\php.exe composer.phar install

* Rename resources/config/config.sample.php into resources/config/config.php
* Adapt database settings in resources/config/config.php file

    PATH_TO_PHP.EXE\php.exe bin/console revpdf:application:install --import_samples=[no|yes]



Enable developers mode
----------------------

* Install all packages (including dev): 

	# php composer.phar install --dev

* Enable twig-extensions
  - Modify app.php. 
  - Look for the string "Uncomment this block..."

* Use dump function in twig templates to debug variables (ie: {{ dump(myVar) }})
Note: for unknown reason, the application will be displayed in English

* Enable CSS/JS compression
  - Install yui-compressor
  - Configure path to yui-compressor in resources/config/config.php
  - Enable compression with AsseticExtension section in app.php

* Launching javascript tests
  - Load page "tests-javascript/index.html" into your browser

* Launching selenium tests
  - Using Firefox, download ans install Selenium IDE 
    from http://seleniumhq.org/download/



Help
----

* http://www.revpdf.org


Components
----------
RevPDF is powered by powerful and robust components (thanks to their authors):

* Silex Kitchen Edition (https://github.com/lyrixx/Silex-Kitchen-Edition)
* HTML5 boilerplate (http://html5boilerplate.com)
* Twitter Bootrap v2 with form integration (http://twitter.github.com/bootstrap)
* Silex extensions & Providers:
    * Assetics
    * Doctrine
    * Form
    * Monolog
    * Session
    * SymfonyBridge
    * Translation
    * Twig
    * UrlGenerator
* jQuery (http://jquery.com)
* json2 (http://www.JSON.org/js.html)
* jQuery Tablesorter (http://tablesorter.com)
* jQuery contextMenu (http://medialize.github.com/jQuery-contextMenu)
* Bootstrap-colorpicker (http://www.eyecon.ro/bootstrap-colorpicker)
* Bootstrap-tooltip (http://twitter.github.com/bootstrap/javascript.html#tooltips)
* Bootstrap Themes (http://bootswatch.com/)

Licence
-------

    Please see LICENCE file



Original Licence from Silex-Kitchen-Edition
-------

Copyright (C) 2012 Grégoire Pineau

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUTOF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.