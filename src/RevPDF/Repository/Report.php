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

class Report Extends Repository
{
    public function getTableName()
    {
        return '_r_report';
    }

    public function lastInsertId()
    {
        return $this->db->lastInsertId();
    }

    public function insert(array $data)
    {
        if (!isset($data['created_at'])) {
            $today = new \DateTime();
            $data['created_at'] = $today->format('Y-m-d H:i:s');
        }
        $data['updated_at'] = '';

        parent::insert($data);
    }

    /**
     * Get the field names list from the field reportSourceValue
     *
     * @param $sourceValue
     *
     * @return array
     */
    public function getColumnsNames($sourceValue)
    {
        if (empty($sourceValue)) {
            return array();
        }
        $a_columnNames = array();
        $arrayFieldNames = array();

        preg_match_all("/(select|SELECT)(.*)(from|FROM)/Us", $sourceValue, $arrayFieldNames);
        $fields = $arrayFieldNames[1];
        if (count($fields) != 0) {
            try {
                $row = $this->db->fetchAssoc($sourceValue);
            } catch (exception $recordset) {
                return $a_columnNames;
            }
            if ($row > 0) {
                foreach ($row as $columnName => $value) {
                    $a_columnNames[trim($columnName)] = trim($columnName);
                }
            }
        }

        return ($a_columnNames);
    }
}