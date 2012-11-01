<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace RevPDF\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Collection;

class UserLoginType extends AbstractType
{
    public function getName()
    {
        return '';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('_username', 'email', array('label' => 'form.user.email', 'required' => true))
            ->add('_password', 'password', array('label' => 'form.user.password', 'required' => true));
    }

    public function getDefaultOptions(array $options)
    {
        $collectionConstraint = new Collection(
            array(
                '_username' => array(
                    new NotBlank(),
                    new Email(),
                ),
                '_password' => array(
                    new NotBlank(),
                )
            )
        );

        return array('validation_constraint' => $collectionConstraint);
    }

}
