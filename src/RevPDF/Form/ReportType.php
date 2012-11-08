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
use Symfony\Component\Validator\Constraints\Collection;

class ReportType extends AbstractType
{
    public function getName()
    {
        return 'Report';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('id', 'hidden')
        ->add('full_name', 'text', array('label' => 'form.report.fullname', 'required' => true))
        ->add('short_name', 'text', array('label' => 'form.report.shortname'))
        ->add('comments', 'text', array('label' => 'form.report.comments'))
        ->add('source_type', 'choice', array(
            'label' => 'form.report.sourcetype',
            'choices'   => array(
                'None' => 'form.report.sourcetype.none',
                'DB' => 'form.report.sourcetype.database'
            ),'required'  => true,
        ))
        ->add('source_value', 'textarea', array('label' => 'form.report.sourcevalue'))
        ->add('filename', 'text', array('label' => 'form.report.filename'))
        ->add('file_destination', 'choice', array(
            'label' => 'form.report.filedestination',
            'choices'   => array(
                'I' => 'form.report.pdf.destination.automaticopening',
                'D' => 'form.report.pdf.destination.sendtobrowser',
                'F' => 'form.report.pdf.destination.saveinfile',
            ),
            'required'  => true,
        ))
        ->add('author', 'text', array('label' => 'form.report.author'))
        ->add('keywords', 'text', array('label' => 'form.report.keywords'))
        ->add('subject', 'text', array('label' => 'form.report.subject'))
        ->add('title', 'text', array('label' => 'form.report.title'))
        ->add('display_mode_zoom', 'choice', array(
            'label' => 'form.report.display_mode_zoom',
            'choices'   => array(
                'fullpage' => 'form.report.pdf.display_mode_zoom.fullpage',
                'fullwidth' => 'form.report.pdf.display_mode_zoom.fullwidth',
                'real' => 'form.report.pdf.display_mode_zoom.real',
                'default' => 'form.report.pdf.display_mode_zoom.default',
            ),
            'required'  => true,
        ))
        ->add('display_mode_layout', 'choice', array(
            'label' => 'form.report.display_mode_layout',
            'choices'   => array(
                'continuous' => 'form.report.pdf.display_mode_layout.continuous',
                'single' => 'form.report.pdf.display_mode_layout.single',
                'two' => 'form.report.pdf.display_mode_layout.two',
                'default' => 'form.report.pdf.display_mode_layout.default',
            ),
            'required'  => true,
        ))
        ->add('paper_format', 'choice', array(
            'label' => 'form.report.paper_format',
            'choices'   => array(
                'A4' => 'form.report.pdf.paper_format.a4',
                'A3' => 'form.report.pdf.paper_format.a3',
                'Letter' => 'form.report.pdf.paper_format.letter',
                'Legal' => 'form.report.pdf.paper_format.legal',
            ),
            'required'  => true,
         ))
        ->add('page_orientation', 'choice', array(
            'label' => 'form.report.page_orientation',
            'choices'   => array(
                'P' => 'form.report.pdf.page_orientation.portrait',
                'L' => 'form.report.pdf.page_orientation.landscape',
            ),
            'required'  => true,
         ))
        ->add('top_margin', 'text', array('label' => 'form.report.top_margin', 'data' => 10))
        ->add('bottom_margin', 'text', array('label' => 'form.report.bottom_margin', 'data' => 10))
        ->add('right_margin', 'text', array('label' => 'form.report.right_margin', 'data' => 10))
        ->add('left_margin', 'text', array('label' => 'form.report.left_margin', 'data' => 10));
    }

    public function getDefaultOptions(array $options)
    {
        $collectionConstraint = new Collection(array(
            'id' => new Type('numeric'),
            'full_name' => array(
                new Type('string'),
                new NotBlank(),
             ),
            'short_name' => new Type('string'),
            'comments' => new Type('string'),
            'source_type' => new Type('string'),
            'source_value' => new Type('string'),
            'filename' => new Type('string'),
            'file_destination' => new Type('string'),
            'author' => new Type('string'),
            'keywords' => new Type('string'),
            'subject' => new Type('string'),
            'title' => new Type('string'),
            'display_mode_zoom' => new Type('string'),
            'display_mode_layout' => new Type('string'),
            'paper_format' => new Type('string'),
            'page_orientation' => new Type('string'),
            'top_margin' => new Type('numeric'),
            'bottom_margin' => new Type('numeric'),
            'right_margin' => new Type('numeric'),
            'left_margin' => new Type('numeric'),
        ));

        return array('validation_constraint' => $collectionConstraint);
    }

}
