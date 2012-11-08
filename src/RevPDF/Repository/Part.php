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

class Part Extends Repository
{
    protected $parts = array(
        \RevPDFLib\Items\Part\PageHeader::ID => 'pageheader',
        \RevPDFLib\Items\Part\ReportHeader::ID => 'reportheader',
        \RevPDFLib\Items\Part\Details::ID => 'details',
        \RevPDFLib\Items\Part\PageFooter::ID => 'pagefooter',
        \RevPDFLib\Items\Part\ReportFooter::ID => 'reportfooter'
    );

    public function getParts()
    {
        return $this->parts;
    }

    public function getTableName()
    {
        return '_r_part';
    }

    public function insert(array $data)
    {
        $data['name'] = $this->parts[$data['weight']];

        if (!isset($data['created_at'])) {
            $today = new \DateTime();
            $data['created_at'] = $today->format('Y-m-d H:i:s');
        }
        $data['updated_at'] = '';

        parent::insert($data);
    }

    public function update(array $data, array $identifier)
    {
        $today = new \DateTime();
        $data['name'] = $this->parts[$data['weight']];
        $data['updated_at'] = $today->format('Y-m-d H:i:s');

        parent::update($data, $identifier);
    }

    public function findAllByReport($reportId, $orderBy = '')
    {
        $sql = sprintf('SELECT * FROM %s WHERE report_id = %d', $this->getTableName(), $reportId);
        if (!empty($orderBy)) {
            $sql .= ' ORDER BY ' . $orderBy;
        }
        return $this->db->fetchAll($sql);
    }
}
