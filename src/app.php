<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

require_once __DIR__.'/../vendor/autoload.php';

use Silex\Provider\SessionServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Provider\FormServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\TranslationServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Knp\Provider\RepositoryServiceProvider;
use Silex\Provider\SwiftmailerServiceProvider;

use Symfony\Component\Translation\Loader\YamlFileLoader;

$app = new Silex\Application();

// Debug
$app['debug'] = isset($debug) ? (int)$debug : 0;

// Gui & Lib
$app['lib'] = array(
    'name' => \RevPDFLib\Application::NAME,
    'version' => \RevPDFLib\Application::VERSION,
    'instance' => new \RevPDFLib\Application()
);
$app['gui'] = array(
    'name' => \RevPDF\Core::NAME,
    'version' => \RevPDF\Core::getVersion(),
    'mmPxConversion' => 4
);

$pathToConfigFile = __DIR__ . '/../resources/config/config.php';
if (!file_exists($pathToConfigFile)) {
    throw new \Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException($pathToConfigFile);
}
require __DIR__ . '/../resources/config/config.php';


// Cache
$app['cache.path'] = __DIR__ . '/../cache';

// Http cache
$app['http_cache.cache_dir'] = $app['cache.path'] . '/http';



$app->register(new SessionServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new FormServiceProvider());
$app->register(new UrlGeneratorServiceProvider());
$app->register(new SwiftmailerServiceProvider(), array(
     'swiftmailer.options' => array(
        'host' => $app['mailer.config.host'],
        'port' => $app['mailer.config.port'],
        'username' => $app['mailer.config.username'],
        'password' => $app['mailer.config.password'],
        'encryption' => $app['mailer.config.encryption'],
        'auth_mode' => $app['mailer.config.auth_mode']),
));



/**
 * It should be placed *BEFORE* TranslationServiceProvider registration 
 */
$app->before(
    function () use ($app) {
        if ($app['request']->get('locale') && in_array($app['request']->get('locale'), $app['supported_languages'])) {
            $app['locale'] = $app['request']->get('locale');
        } else {
            return $app->redirect(
                $app['url_generator']->generate(
                    'homepage', 
                    array('locale' => $app['locale.fallback'])
                )
            );
        }
    }
);

/**
 * Services:
 *
 * translator: An instance of Translator, that is used for translation.
 * translator.loader: An instance of an implementation of the translation
 *                    LoaderInterface, defaults to an ArrayLoader.
 * translator.message_selector: An instance of MessageSelector.
 */
$app->register(
    new TranslationServiceProvider(), array(
        'locale.fallback' => $app['locale_fallback'],
    )
);
$app['translator'] = $app->share(
    $app->extend(
        'translator', function($translator, $app) {
            $translator->addLoader('yaml', new YamlFileLoader());

            $translator->addResource('yaml', __DIR__.'/../resources/locales/en.yml', 'en');
            $translator->addResource('yaml', __DIR__.'/../resources/locales/fr.yml', 'fr');

            return $translator;
        }
    )
);

/**
 * Services:
 *  monolog: The monolog logger instance.
 *  monolog.configure: Protected closure that takes the logger as an argument.
 * You can override it if you do not want the default behavior.
 *      100 => 'DEBUG',
 *      200 => 'INFO',
 *      300 => 'WARNING',
 *      400 => 'ERROR',
 *      500 => 'CRITICAL',
 *      550 => 'ALERT',
 */
$app->register(
    new MonologServiceProvider(), array(
        'monolog.logfile'       => $app['log.filepath'],
        'monolog.name'          => 'app',
        'monolog.level'         => $app['debug'] == 1 ? 100 : 400 

    )
);

/**
 * Services:
 *  twig: The Twig_Environment instance. The main way of interacting with Twig.
 *  twig.configure: Protected closure that takes the Twig environment as an
 *                  argument. You can use it to add more custom globals.
 *  twig.loader: The loader for Twig templates which uses the twig.path and the
 *               twig.templates options. You can also replace the loader
 *               completely.
 */
$app->register(
    new TwigServiceProvider(), array(
        'twig.options'          => array('cache' => false, 'strict_variables' => true),
        'twig.form.templates'   => array('form_div_layout.html.twig', 'common/form_div_layout.html.twig'),
        'twig.path'             => array(__DIR__ . '/../templates')
    )
);

/* Uncomment this block to enable developers functions
$app['twig']->addExtension(new Twig_Extension_Debug()); */

/**
 * Services:
 *  db: The database connection, instance of Doctrine\DBAL\Connection.
 *  db.config: Configuration object for Doctrine.
 *             Defaults to an empty Doctrine\DBAL\Configuration.
 *  db.event_manager: Event Manager for Doctrine.
 */
$app->register(
    new DoctrineServiceProvider(), array(
        'db.options'    => array(
            'driver'    => $app['db.config.driver'],
            'dbname'    => $app['db.config.dbname'],
            'host'      => $app['db.config.host'],
            'user'      => $app['db.config.user'],
            'password'  => $app['db.config.password'],
            'charset'   => 'utf8'
        )
    )
);

/**
 * Services:
 * $app['repository.application']
 * $app['repository.report']
 * ...
 */
$app->register(
    new RepositoryServiceProvider(), array(
            'repository.repositories' => array(
            'repository.application'  => 'RevPDF\\Repository\\Application',
            'repository.report'       => 'RevPDF\\Repository\\Report',
            'repository.part'         => 'RevPDF\\Repository\\Part',
            'repository.element'      => 'RevPDF\\Repository\\Element',
            'repository.user'         => 'RevPDF\\Repository\\UserProvider',
        )
    )
);


if (isset($enable_assetic) && $enable_assetic == 1) {
    require 'app_assetic.php';
}

return $app;

