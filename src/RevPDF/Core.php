<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace RevPDF;

class Core
{
    /**
     * Application Name
     */
    const NAME = 'RevPDF';

    /**
     * Get RevPDF version
     *
     * @return string
     */
    public static function getVersion()
    {
        $location = __DIR__ . '/../../VERSION';

        if (file_exists($location)) {
            $handle = fopen($location, "r");
            $line = fgets($handle);
            fclose($handle);
            return $line;
        } else {
            return 'unknown';
        }
    }

    /**
     * Returns an array with all parts and their identifiers
     *
     * @return array Associative array
     */
//    public static function getPartTypes($app)
//    {
//        $partTypes = array(
//            \RevPDFLib\Items\Part\PageHeader::ID => $app['translator']->trans('lbl.part.page_header'),
//            \RevPDFLib\Items\Part\ReportHeader::ID => $app['translator']->trans('Report Header'),
//            \RevPDFLib\Items\Part\Details::ID => $app['translator']->trans('Data'),
//            \RevPDFLib\Items\Part\PageFooter::ID => $app['translator']->trans('Page Footer'),
//            \RevPDFLib\Items\Part\ReportFooter::ID => $app['translator']->trans('Report Footer')
//        );
//
//        return $partTypes;
//    }
}