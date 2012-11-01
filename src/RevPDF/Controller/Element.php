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

class Element implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controller = new ControllerCollection($app['route_factory']);
        
        // Element Delete (POST)
        $controller->post('delete', function() use ($app) {
            $id = $app['request']->get('elementId');
            $result = $app['repository.element']->delete(array('id' => $id));
            
            if ($result == 1) {
                return $app->json('OK');
            }
            return $app->json('KO');
        })->bind('route.element.delete');


        return $controller;
    }
}