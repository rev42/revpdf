<?php

    /*
    * This file is part of RevPDF application.
    *
    * (c) Olivier Cornu <contact@revpdf.org>
    *
    * For full copyright and license information, please view the LICENSE
    * file that was distributed with this source code.
    */

namespace RevPDF\Controller;

use Silex\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;

class Root implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controller = new ControllerCollection($app['route_factory']);

        $controller->match(
            '/', function () use ($app) {
                if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
                    $browsersLocale = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
                    if (in_array($browsersLocale, array('en', 'fr'))) {
                        $app['locale'] = $browsersLocale;
                    }
                }

                return $app->redirect(
                    $app['url_generator']->generate(
                        'homepage',
                        array('locale' => $app['locale'])
                    )
                );
            }
        )->bind('home');

        $controller->match(
            '/{locale}/', function() use ($app) {
                // Get all reports
                $reports = $app['repository.report']->findAll();

                return $app['twig']->render(
                    'Report/list.html.twig', array(
                        'reports' => $reports,
                    )
                );
            }
        )->bind('homepage');



        return $controller;
    }
}