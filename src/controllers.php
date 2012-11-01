<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app->error(
    function (\Exception $e, $code) use ($app) {
        if ($app['debug']) {
            return;
        }

        $page = 404 == $code ? '404.html.twig' : '500.html.twig';

        return new Response(
            $app['twig']->render(
                $page, array(
                    'code' => $code
                )
            ), $code
        );
    }
);

$app->mount('/', new \RevPDF\Controller\Root());
$app->mount('/{locale}/Part', new \RevPDF\Controller\Part());
$app->mount('/{locale}/Report', new \RevPDF\Controller\Report());
$app->mount('/{locale}/Element', new \RevPDF\Controller\Element());

return $app;
