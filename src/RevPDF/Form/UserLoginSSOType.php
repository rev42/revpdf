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
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserLoginSSOType extends AbstractType
{
    public function getName()
    {
        return '';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('openid_identifier', 'hidden', array('data' => 'https://www.google.com/accounts/o8/id', 'required' => true))
            ->add('returnUrl', 'hidden', array('data' => '/', 'required' => true))
            ->add('confirmNew', 'hidden', array('data' => 'true', 'required' => true));
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $collectionConstraint = new Collection(
            array(
                'openid_identifier' => array(
                    new NotBlank(),
                ),
                'returnUrl' => array(
                    new NotBlank(),
                ),
                'confirmNew' => array(
                    new NotBlank(),
                )
            )
        );

        return array('validation_constraint' => $collectionConstraint);
    }

}
