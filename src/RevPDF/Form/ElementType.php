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
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ElementType extends AbstractType
{
    public function getName()
    {
        return 'Element';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $fontsizes = array();
        $arrayFontSize = explode(',', '8,9,10,11,12,14,16,18,20,22,24,28,36,48');
        for ($i = 0; $i < count($arrayFontSize); $i++) {
            $fontsizes[$arrayFontSize[$i]] = $arrayFontSize[$i].'pt';
        }

        $borderWidths = array();
        $arrayBorderWidth = explode(',', '0.20,0.50,1');
        for ($i = 0; $i < count($arrayBorderWidth); $i++) {
            ($i == 0) ? $borderWidths[$arrayBorderWidth[$i]] = 'Thin':'';
            ($i == 1) ? $borderWidths[$arrayBorderWidth[$i]] = 'Medium':'';
            ($i == 2) ? $borderWidths[$arrayBorderWidth[$i]] = 'Thick':'';
        }

        $builder
        ->add(
            'font_family',
            'choice',
            array(
                'label' => 'form.element.font_family',
                'choices'   => array(
                    'courier'       => 'Courier',
                    'Deja Vu Sans'  => 'Deja Vu Sans',
                    'Deja Vu Serif' => 'Deja Vu Serif',
                    'helvetica'     => 'Helvetica',
                    'symbol'        => 'Symbol',
                    'times'         => 'Times',
                    'zapfdingbats'  => 'ZapfDingbats'
                )
            )
        )
        ->add('size', 'choice', array('label' => 'form.element.fontsize', 'choices'   => $fontsizes))
        ->add('border_width', 'choice', array('label' => 'form.element.borderwidth','choices'   => $borderWidths))
        ->add('fill_color', 'hidden')
        ->add('text_color', 'hidden')
        ->add('posx', 'hidden')
        ->add('posy', 'hidden')
        ->add('posxmm', 'text', array('label' => 'form.element.posxmm'))
        ->add('posymm', 'text', array('label' => 'form.element.posymm'))
        ->add('width', 'text', array('label' => 'form.element.widthmm'))
        ->add('height', 'text', array('label' => 'form.element.heightmm'))
        ->add('zindex', 'text', array('label' => 'form.element.zindex'))
        ->add(
            'format',
            'choice',
            array(
                'label' => 'form.element.format',
                'choices'   => array(
                    'text'      => 'Text',
                    'number'    => 'Number',
                    'image'     => 'Image',
                    'Fulldate'  => 'Date, Full',
                    'AbrevDate' => 'Date, abrev.',
                    'YesNo'     => 'Yes/No',
                    //'qrCode'    => 'QR Code'
                )
             )
        )
        ->add(
            'is_auto_extend',
            'choice',
            array(
                'label' => 'form.element.is_auto_extend',
                'choices'   => $this->getYesNoList()
            )
        )
        ->add(
            'source_control',
            'choice',
            array(
                'label' => 'form.element.source_control',
                'mapped' => false,
                'choices' => $options['data']['sourceFields']
            )
        )
        ->add(
            'element_field',
            'text',
            array('label' => 'form.element.element_field', 'attr' => array('style' => 'display:none'))
        )
        ->add(
            'delete_element_url',
            'hidden',
            array('data' => $options['data']['deleteElementUrl'], "mapped" => false)
        )
        ->add('formElementSelected', 'hidden')
        ->add('type', 'hidden');
    }

    protected function getYesNoList()
    {
        return array('0' => 'form.choice.no', '1' => 'form.choice.yes');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $collectionConstraint = new Collection(array('size' => new Type('numeric')));

        return array(
            'validation_constraint' => $collectionConstraint
        );
    }
}
