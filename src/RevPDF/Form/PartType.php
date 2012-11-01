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
use Symfony\Component\Validator\Constraints\Collection;

class PartType extends AbstractType
{
    public function getName()
    {
        return 'Part';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('id', 'hidden')
        ->add('report_id', 'hidden')
        ->add('weight', 'choice', array(
            'label' => 'form.part.type',
            'choices'   => array(
            \RevPDFLib\Items\Part\PageHeader::ID => 'lbl.part.page_header',
            \RevPDFLib\Items\Part\ReportHeader::ID => 'lbl.part.report_header',
            \RevPDFLib\Items\Part\Details::ID => 'lbl.part.details',
            \RevPDFLib\Items\Part\PageFooter::ID => 'lbl.part.page_footer',
            \RevPDFLib\Items\Part\ReportFooter::ID => 'lbl.part.report_footer'
        )))
        ->add('height', 'text', array(
            'label' => 'form.part.height',
        ))
        ->add('is_visible', 'choice', array(
            'label' => 'form.part.is_visible',
            'choices'   => $this->getYesNoList(),
            'expanded' => false,
            'multiple' => false,
        ))
        ->add('is_page_jump', 'choice', array(
            'label' => 'form.part.is_page_jump',
            'choices'   => $this->getYesNoList(),
            'expanded' => false,
            'multiple' => false,
        ))
        ->add('is_indivisible', 'choice', array(
            'label' => 'form.part.is_indivisible',
            'choices'   => $this->getYesNoList(),
            'expanded' => false,
            'multiple' => false,
        ))
        ->add('is_auto_extend', 'choice', array(
            'label' => 'form.part.is_auto_extend',
            'choices'   => $this->getYesNoList(),
            'expanded' => false,
            'multiple' => false,
        ))
        ->add('is_auto_reduc', 'choice', array(
            'label' => 'form.part.is_auto_reduc',
            'choices'   => $this->getYesNoList(),
            'expanded' => false,
            'multiple' => false,
        ))
        ->add('sort_order', 'choice', array(
            'label' => 'form.part.sort_order',
            'choices'   => array('asc' => 'form.choice.asc', 'desc' => 'form.choice.desc'),
            'expanded' => false,
            'multiple' => false,
        ))
        ;
    }

    protected function getYesNoList()
    {
        return array('0' => 'form.choice.no', '1' => 'form.choice.yes');
    }

    public function getDefaultOptions(array $options)
    {
        $collectionConstraint = new Collection(array(
            'id' => new Type('numeric'),
            'report_id' => new Type('numeric'),
            'weight' => new Type('numeric'),
            'height' => new Type('numeric'),
            'is_visible' => new Type('numeric'),
            'is_page_jump' => new Type('numeric'),
            'is_indivisible' => new Type('numeric'),
            'is_auto_extend' => new Type('numeric'),
            'is_auto_reduc' => new Type('numeric'),
            'sort_order' => new Type('string'),
        ));

        return array(
            'validation_constraint' => $collectionConstraint
        );
    }

}
