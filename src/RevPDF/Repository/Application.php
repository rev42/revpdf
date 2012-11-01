<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace RevPDF\Repository;

use Knp\Repository;

class Application Extends Repository
{
    /**
     * Constant: page format A5 (148x210)
     *
     * @var string (width_height)
     */
    const A5 = '148_210';
    /**
     * Constant: page format A4 (210x297)
     *
     * @var string (width_height)
     */
    const A4 = '210_297';
    /**
     * Constant: page format A3 (297x420)
     *
     * @var string (width_height)
     */
    const A3 = '297_420';
    /**
     * Constant: page format Letter (216x276)
     *
     * @var string (width_height)
     */
    const LETTER = '216_279';
    /**
     * Constant: page format Legal (216x356)
     *
     * @var string (width_height)
     */
    const LEGAL = '216_356';
    /**
     * Constant: factor to convert millimeter into Pixel
     *
     * @var int
     */

    /**
     * Get report width in mm
     *
     * @param $paperFormat
     * @param $pageOrientation
     *
     * @return mixed
     */
    public function getWidth($paperFormat, $pageOrientation)
    {
        $dimensions = explode("_", constant('self::' . strtoupper($paperFormat)));
        if ($pageOrientation == 'P') {
            return $dimensions[0];
        } else {
            return $dimensions[1];
        }
    }

    public function getDimensions($paperFormat, $pageOrientation)
    {
        return array(
            'width' => $this->getWidth($paperFormat, $pageOrientation),
            'height' => $this->getHeight($paperFormat, $pageOrientation)
        );
    }

    /**
     * Get report height in mm
     *
     * @param $paperFormat
     * @param $pageOrientation
     *
     * @return mixed
     */
    public function getHeight($paperFormat, $pageOrientation)
    {
        $dimensions = explode("_", constant('self::' . strtoupper($paperFormat)));
        if ($pageOrientation == 'P') {
            return $dimensions[1];
        } else {
            return $dimensions[0];
        }
        return $this;
    }

    public function getTableName()
    {
        return '_r_application';
    }

}