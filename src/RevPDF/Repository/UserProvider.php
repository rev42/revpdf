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

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Doctrine\DBAL\Connection;

use Knp\Repository;

use RevPDF\Repository\User;

class UserProvider extends Repository implements UserProviderInterface
{
    public $db;

    public function __construct(Connection $db)
    {
        $this->db = $db;
    }


    public function getTableName()
    {
        return '_r_user';
    }


    public function insert(array $data)
    {
        if (!isset($data['created_at'])) {
            $today = new \DateTime();
            $data['created_at'] = $today->format('Y-m-d H:i:s');
        }
        $data['updated_at'] = '';
        $data['confirmation_token'] = $this->createHash();

        return parent::insert($data);
    }

    /**
     * Create mail validation link
     * 
     * @return string
     */
    protected function createHash()
    {
        $bytes = hash('sha256', uniqid(mt_rand(), true), true);

        return base_convert(bin2hex($bytes), 16, 36);
    }

    public function loadUserByUsername($username)
    {
        $user = $this->getUser($username);
        if (!$user) {
            throw new UsernameNotFoundException(sprintf('Username "%s" does not exist.', $username));
        }

        return new User($user['mail'], $user['password'], $user['id'], explode(',', $user['roles']), $user['enabled'], true, true, true, $user['confirmation_token']);
    }

    public function findByConfirmationToken($token)
    {
        $stmt = $this->db->executeQuery(sprintf('SELECT * FROM %s WHERE confirmation_token = ? LIMIT 1', $this->getTableName()), array((string) $token));

        if (!$user = $stmt->fetch()) {
            return null;
        }

        return new User($user['mail'], $user['password'], $user['id'], explode(',', $user['roles']), $user['enabled'], true, true, true, $user['confirmation_token']);
    }

    public function getUser($username)
    {
        $stmt = $this->db->executeQuery(sprintf('SELECT * FROM %s WHERE mail = ? LIMIT 1', $this->getTableName()), array(strtolower($username)));

        if (!$user = $stmt->fetch()) {
            return null;
        }

        return $user;
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        return $this->loadUserByUsername($user->getUsername());
    }

    public function supportsClass($class)
    {
        return $class === 'Symfony\Component\Security\Core\User\User';
    }
}