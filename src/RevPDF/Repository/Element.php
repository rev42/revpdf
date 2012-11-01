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

class Element Extends Repository
{
    public function getTableName()
    {
        return '_r_element';
    }

    public function findAllByPart($partId)
    {
        $sql = sprintf('SELECT * FROM %s WHERE part_id = %d', $this->getTableName(), $partId);

        return $this->db->fetchAll($sql);
    }

    /**
     * Save elements
     * 
     * @param object $elements
     * 
     * @return int Sum of inserted and updated elements
     */
    public function saveElements($elements)
    {
        $res = 0;
        foreach ($elements as $myElement) {
            $myElement = get_object_vars($myElement);
            if ($myElement['updated'] == 1) {
                $element = array(
                            'part_id' => $myElement['elementPartId'],
                            'type' => $myElement['elementType'],
                            'field' => $myElement['elementField'],
                            'format' => $myElement['elementFormat'],
                            'fill_color' => $myElement['elementFillColor'],
                            'text_color' => $myElement['elementTextColor'],
                            'border' => $myElement['elementBorder'],
                            'border_width' => $myElement['elementBorderWidth'],
                            'font_family' => $myElement['elementFontFamily'],
                            'size' => $myElement['elementSize'],
                            'is_auto_extend' => $myElement['elementAutoExtend'],
                            'style' => $myElement['elementStyle'],
                            'alignment' => $myElement['elementAlignment'],
                            'posx' => $myElement['elementPosXmm'],
                            'posy' => $myElement['elementPosYmm'],
                            'height' => $myElement['elementHeightMM'],
                            'width' => $myElement['elementWidthMM'],
                            'zindex' => (int) $myElement['elementZIndex'],
                );

                if (is_numeric($myElement['elementID']) === true) {
                    $res += $this->update($element, array('id' => $myElement['elementID']));
                } else {
                    $res += $this->insert($element);
                }
            }
        }
        return $res;
    }
}