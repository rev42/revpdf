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

use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserSignupType extends AbstractType
{
    public function getName()
    {
        return 'UserSignup';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('fullname', 'text', array('label' => 'form.user.fullname', 'required' => true))
            ->add('mail', 'email', array('label' => 'form.user.email', 'required' => true))
            ->add('password', 'repeated', array(
                'type' => 'password',
                'invalid_message' => 'message.user.signup.password_doesnt_match',
                'options' => array('label' => 'form.user.password'), 
                'required' => true
             ))
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $collectionConstraint = new Collection(array(
            'fullname' => array(
                new NotBlank(),
            ),
            'mail' => array(
                new Email(),
                new NotBlank(),
             ),
            'password' => array(
                new NotBlank(),
            )
        ));

        return array('validation_constraint' => $collectionConstraint);
    }

}
