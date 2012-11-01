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
use Symfony\Component\HttpFoundation\Response;

class Report implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controller = new ControllerCollection($app['route_factory']);

        // Report Add (GET)
        $controller->get('add', function() use ($app) {
            $form = $app['form.factory']->createBuilder(
                        new \RevPDF\Form\ReportType()
                    )->getForm();

            return $app['twig']->render('Report/add.html.twig', array(
                'form' => $form->createView()
            ));
        })->bind('route.report.add');



        // Report Add (POST)
        $controller->post('add', function() use ($app) {
            $form = $app['form.factory']->createBuilder(
                        new \RevPDF\Form\ReportType()
                    )->getForm();

            $form->bindRequest($app['request']);
            $data = $form->getData();

            if ($form->isValid()) {
                try {
                    $result = $app['repository.report']->insert($data);
                    
                    if ($result !== false) {
                        $partInfo = $app['repository.part']->getParts();
                        $defaultProperties = array(
                            'is_visible' => 1,
                            'is_page_jump' => 0,
                            'is_indivisible' => 0,
                            'is_auto_extend' => 1,
                            'is_auto_reduc' => 1,
                            'sort_order' => 'asc',
                            'height' => 10,
                            'report_id' => $app['repository.report']->lastInsertId()
                        );
                        $defaultParts = array(
                            array(
                                'weight' => 0,
                                'name' => $partInfo[0],
                            ),
                            array(
                                'weight' => 5,
                                'name' => $partInfo[5]
                            ),
                        );
                        
                        foreach ($defaultParts as $data) {
                            $data = array_merge($data, $defaultProperties);
                            $result = $app['repository.part']->insert($data);
                        }
                    }
                } catch (\Exception $e) {
                    $result = false;
                    $app['session']->setFlash('warning', $e->getMessage());
                }
                if ($result !== false) {
                    $app['session']->setFlash('success', 'message.element_created');

                    return $app->redirect($app['url_generator']->generate(
                            'homepage',
                            array('locale' => $app['locale'])
                    ));
                }
            } else {
                $app['session']->setFlash('warning', 'form.invalid.supply');
            }

            return $app['twig']->render('Report/add.html.twig', array(
                'form' => $form->createView(),
                'post' => $data,
            ));
        })->bind('route.report.create');



        // Report Modify (GET)
        $controller->get('modify/{id}', function($id) use ($app) {
            $report = $app['repository.report']->find($id);
            $report['dimensions'] = $app['repository.application']->getDimensions($report['paper_format'], $report['page_orientation']);
            $sourceFieldsChoices = $app['repository.report']->getColumnsNames($report['source_value']);

            $parts = $app['repository.part']->findAllByReport($id, 'weight asc');
            foreach ($parts as &$part) {
                $part['Elements'] = $app['repository.element']->findAllByPart($part['id']);
            }

            $partForm = $app['form.factory']->createBuilder(
                            new \RevPDF\Form\PartType()
                        )->getForm();

            $elementForm = $app['form.factory']->createBuilder(
                            new \RevPDF\Form\ElementType(),
                            null,
                            array('data' => array(
                                'sourceFields' => $sourceFieldsChoices,
                                'deleteElementUrl' => $app['url_generator']->generate(
                                        'route.element.delete',
                                        array(
                                            'locale' => $app['locale']
                                        )
                                )),
                            )
                        )->getForm();

            return $app['twig']->render('Report/modify.html.twig', array(
                'id' => $id,
                'parts' => $parts,
                'report' => $report,
                'partForm' => $partForm->createView(),
                'elementForm' => $elementForm->createView()
            ));
        })->bind('route.report.modify');
        
        
        
        // Report Save (POST)
        $controller->post('save/{reportId}', function($reportId) use ($app) {
            // Json data
            $app['monolog']->addDebug($app['request']->get('serialized'));
            $parts = json_decode($app['request']->get('serialized'));
            
            if (is_null($parts)) {
                return $app->json(array('status' => 'KO', 'message' => $app['translator']->trans('message.incorrect_json_data')), 500);
            }
            
            // Save part data
            foreach ($parts as $part) {
                $partLoaded = $app['repository.part']->find($part->partId);
                if (is_array($partLoaded)) {
                    // Save elements
                    $res = $app['repository.element']->saveElements($part->partElementList);
                    $app['monolog']->addDebug('Number of updated/inserted elements: ' . $res);
                    // Save part
                    $partLoaded['height'] = $part->height;
                    $app['repository.part']->update($partLoaded, array('id' => $partLoaded['id']));
                }
            }
            
            return $app->json(array('status' => 'OK', 'message' => $app['translator']->trans('message.element_updated')), 200);
        })->bind('route.report.save');
        
        
        
        // Report Edit (GET)
        $controller->get('edit/{id}', function($id) use ($app) {
            $report = $app['repository.report']->find($id);
            $builder = $app['form.factory']->createBuilder(
                    new \RevPDF\Form\ReportType(),
                    $report);
            $form = $builder->getForm();

            return $app['twig']->render('Report/edit.html.twig', array(
                'form' => $form->createView(),
            ));
        })->bind('route.report.edit');

        

        // Report Update (POST)
        $controller->post('update', function() use ($app) {
            $form = $app['form.factory']->createBuilder(
                            new \RevPDF\Form\ReportType()
                    )->getForm();

            $form->bindRequest($app['request']);
            $data = $form->getData();

            if ($form->isValid()) {
                try {
                    $result = $app['repository.report']->update($data, array('id' => $data['id']));
                } catch (\Exception $e) {
                    $result = false;
                    $app['session']->setFlash('warning', $e->getMessage());
                }
                if ($result !== false) {
                    $app['session']->setFlash('success', 'message.element_updated');

                    return $app->redirect($app['url_generator']->generate(
                            'homepage',
                            array('locale' => $app['locale'])
                    ));
                }
            } else {
                $app['session']->setFlash('warning', 'form.invalid.supply');
            }

            return $app['twig']->render('Report/edit.html.twig', array(
                'form' => $form->createView(),
                'post' => $data,
            ));
        })->bind('route.report.update');


        
        // Report Generate (GET)
        $controller->get('generate/{id}', function($id) use ($app) {
            $report = $app['repository.report']->find($id);
            $parts = $app['repository.part']->findAllByReport($id);
            foreach ($parts as $i => $part) {
                $parts[$i]['Elements'] = $app['repository.element']->findAllByPart($part['id']);
            }

            $data = array();
            $data['report']['shortname'] = $report['short_name'];
            $data['report']['fullname'] = $report['full_name'];
            $data['report']['author'] = $report['author'];
            $data['report']['keywords'] = $report['keywords'];
            $data['report']['subject'] = $report['subject'];
            $data['report']['title'] = $report['title'];
            $data['report']['displayModeZoom'] = $report['display_mode_zoom'];
            $data['report']['displayModeLayout'] = $report['display_mode_layout'];
            $data['report']['comments'] = $report['comments'];
            $data['report']['topMargin'] = $report['top_margin'];
            $data['report']['bottomMargin'] = $report['bottom_margin'];
            $data['report']['rightMargin'] = $report['right_margin'];
            $data['report']['leftMargin'] = $report['left_margin'];
            $data['report']['paperFormat'] = $report['paper_format'];
            $data['report']['pageOrientation'] = $report['page_orientation'];
            // TODO: softcode provider
            $data['source']['provider'] = 'PdoProvider';
            $data['source']['value'] = $report['source_value'];

            if (count($parts) > 0) {
                foreach ($parts as $part) {
                    $partName = $part['name'];
                    $data[$partName]['height'] = $part['height'];
                    $data[$partName]['isVisible'] = $part['is_visible'];
                    $data[$partName]['backgroundColor'] = $part['color'];
                    $data[$partName]['isPageJump'] = $part['is_page_jump'];
                    $data[$partName]['isIndivisible'] = $part['is_indivisible'];
                    $data[$partName]['isAutoExtend'] = $part['is_auto_extend'];
                    $data[$partName]['isAutoReduc'] = $part['is_auto_reduc'];
                    $data[$partName]['sortOrder'] = $part['sort_order'];

                    if (count($part['Elements']) > 0) {
                        foreach ($part['Elements'] as $element) {
                            $data[$partName]['elements'][] = array(
                                'value' => $element['field'],
                                'type' => strtolower($element['type']),
                                'format' => $element['format'],
                                'backcolor' => $element['fill_color'],
                                'forecolor' => $element['text_color'],
                                'border' => $element['border'],
                                'borderWidth' => $element['border_width'],
                                'x' => $element['posx'],
                                'y' => $element['posy'],
                                'width' => $element['width'],
                                'height' => $element['height'],
                                'zindex' => $element['zindex'],
                                'textAlignement' => $element['alignment'],
                                'font' => array(
                                    'fontName' => $element['font_family'],
                                    'size' => $element['size'],
                                    'isBold' => strpos($element['style'], 'B') !== false ? 1 : 0,
                                    'isItalic' => strpos($element['style'], 'I') !== false ? 1 : 0,
                                    'isUnderline' => strpos($element['style'], 'U') !== false ? 1 : 0
                                )
                            );

                        }
                    }
                }
            }

            $lib = new $app['lib']['instance'];
            $lib->setDataSource($app['db']);
            try {
                $response = new Response();
                $lib->export($data);
                $response->headers->set('Content-Type', 'application/pdf');

                return $response;
            } catch (\Exception $e) {
                $app['session']->setFlash('warning', 'message.exception_occurred_with_info');
                $app['monolog']->addwarning('[report.generate] Exception: ' . $e->getMessage());
            }

            return $app->redirect($app['url_generator']->generate(
                'homepage',
                array('locale' => $app['locale'])
            ));

        })->bind('report.generate');



        // Report Export (GET)
        $controller->get('export/{id}.{format}', function($format, $id) use ($app) {
            $report = $app['repository.report']->find($id);
            $parts = $app['repository.part']->findAllByReport($id);
            foreach ($parts as &$part) {
                $part['Elements'] = $app['repository.element']->findAllByPart($part['id']);
            }
            //var_dump($parts);exit;
            $reportAttributes = array(
                'shortname' => 'short_name',
                'fullname' => 'full_name',
                'author' => 'author',
                'keywords' => 'keywords',
                'subject' => 'subject',
                'title' => 'title',
                'displayModeZoom' => 'display_mode_zoom',
                'displayModeLayout' => 'display_mode_layout',
                'comments' => 'comments',
                'topMargin' => 'top_margin',
                'bottomMargin' => 'bottom_margin',
                'rightMargin' => 'right_margin',
                'leftMargin' => 'left_margin',
                'paperFormat' => 'paper_format',
                'pageOrientation' => 'page_orientation',
            );

            if ($report['source_type'] == 'DB') {
                $report['provider'] = 'PdoProvider';
            }

            $partAttributes = array(
                'height' => 'height',
                'isVisible' => 'is_visible',
                'backgroundColor' => 'color',
                'isPageJump' => 'is_page_jump',
                'isIndivisible' => 'is_indivisible',
                'isAutoExtend' => 'is_auto_extend',
                'isAutoReduc' => 'is_auto_reduc',
                'sortOrder' => 'sort_order',
            );

            $elementAttributes = array(
                'format' => 'format',
                'backcolor' => 'fill_color',
                'forecolor' => 'text_color',
                'border' => 'border',
                'borderWidth' => 'border_width',
                'x' => 'posx',
                'y' => 'posy',
                'width' => 'width',
                'height' => 'height',
                'zindex' => 'zindex', 
                'textAlignment' => 'alignment'
            );

            $response = new Response($app['twig']->render('Report/export.'.$format.'.twig', array(
                'report' => $report,
                'parts' => $parts,
                'reportAttributes' => $reportAttributes,
                'partAttributes' => $partAttributes,
                'elementAttributes' => $elementAttributes
            )), 200);
            $response->headers->set('Content-Type', 'text/' . $format . '; charset=UTF-8');

            return $response;
        })->bind('report.export')->assert('format', 'xml|json');


        // Report Delete (GET)
        $controller->get('delete/{id}', function($id) use ($app) {
            $result = $app['repository.report']->delete(array('id' => $id));
            $app['session']->setFlash('success', 'message.element_deleted');

            return $app->redirect($app['url_generator']->generate(
                    'homepage',
                    array('locale' => $app['locale'])
            ));
        })->bind('route.report.delete');

        
        return $controller;
    }
}