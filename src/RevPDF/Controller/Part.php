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

class Part implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controller = new ControllerCollection($app['route_factory']);
        
        // Part Add (GET)
        $controller->get('add/for/Report/{reportId}', function($reportId) use ($app) {
            $defaultData = array(
                'report_id' => $reportId,
                'height' => 10,
                'is_visible' => 1,
                'is_page_jump' => 0,
                'is_indivisible' => 0,
                'is_auto_extend' => 0,
                'is_auto_reduc' => 0,
                'sort_order' => 'asc',
            );
            $form = $app['form.factory']->createBuilder(
                new \RevPDF\Form\PartType(), $defaultData
            )->getForm();

            return $app['twig']->render('Part/add.html.twig', array(
                'form' => $form->createView(),
                'reportId' => $reportId
            ));
        })->bind('route.part.add');
        
        
        
        // Part Add (POST)
        $controller->post('add', function() use ($app) {
            $form = $app['form.factory']->createBuilder(
                new \RevPDF\Form\PartType()
            )->getForm();
    
            $form->bind($app['request']);
            $data = $form->getData();

            if ($form->isValid()) {
                try {
                    $result = $app['repository.part']->insert($data);
                } catch (\Exception $e) {
                    $result = false;
                    $app['session']->getFlashBag()->add('warning', $e->getMessage());
                }
                if ($result !== false) {
                    $app['session']->getFlashBag()->add('success', 'message.element_created');
                }
            } else {
                $app['session']->getFlashBag()->add('warning', 'form.invalid.supply');

                return $app->redirect($app['url_generator']->generate(
                        'route.part.add',
                        array(
                            'locale' => $app['locale'],
                            'reportId' => $data['report_id']
                        )
                    ));
            }
            
            return $app->redirect($app['url_generator']->generate(
                        'route.report.modify',
                        array(
                            'locale' => $app['locale'],
                            'id' => $data['report_id']
                        )
                    ));
        })->bind('route.part.create');
        

        // Part Edit (GET)
        $controller->get('edit/{id}', function($id) use ($app) {
            $part = $app['repository.part']->find($id);
            $builder = $app['form.factory']->createBuilder(
                    new \RevPDF\Form\PartType(),
                    $part);
            $form = $builder->getForm();

            return $app['twig']->render('Part/edit.html.twig', array(
                'form' => $form->createView(),
                'reportId' => $part['report_id']
            ));
        })->bind('route.part.edit');


        // Part Update (POST)
        $controller->post('update', function() use ($app) {
            $form = $app['form.factory']->createBuilder(
                            new \RevPDF\Form\PartType()
                    )->getForm();

            $form->bind($app['request']);
            $data = $form->getData();

            if ($form->isValid()) {
                try {
                    $result = $app['repository.part']->update($data, array('id' => $data['id']));
                } catch (\Exception $e) {
                    $result = false;
                    $app['session']->getFlashBag()->add('warning', $e->getMessage());
                }
                if ($result !== false) {
                    $app['session']->getFlashBag()->add('success', 'message.element_updated');

                    return $app->redirect($app['url_generator']->generate(
                        'route.report.modify',
                        array(
                            'locale' => $app['locale'],
                            'id' => $data['report_id']
                        )
                    ));
                }
            } else {
                $app['session']->getFlashBag()->add('warning', 'form.invalid.supply');
            }

            return $app['twig']->render('Part/edit.html.twig', array(
                'form' => $form->createView(),
                'post' => $data,
            ));
        })->bind('route.part.update');
        
        // Part Delete (GET)
        $controller->get('delete/{id}', function($id) use ($app) {
            $part = $app['repository.part']->find($id);
            $result = $app['repository.part']->delete(array('id' => $id));
            $app['session']->getFlashBag()->add('success', 'message.element_deleted');

            return $app->redirect($app['url_generator']->generate(
                        'route.report.modify',
                        array(
                            'locale' => $app['locale'],
                            'id' => $part['report_id']
                        )
                    ));
        })->bind('route.part.delete');


        return $controller;
    }
}