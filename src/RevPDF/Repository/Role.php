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

class Role Extends Repository
{
    public function getTableName()
    {
        return '_r_role';
    }

    public function findByName($name)
    {
        return $this->db->fetchAssoc(sprintf('SELECT * FROM %s WHERE role_name = ? LIMIT 1', $this->getTableName()), array($name));
    }
}