<?php

/*
* This file is part of RevPDF application.
*
* (c) Olivier Cornu <contact@revpdf.org>
*
* For full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace RevPDF\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Process\Process;

class InstallCommand extends Command
{
    protected $sqlFiles = array();
    protected $baseDir = '';

    protected function configure()
    {
        $this
            ->setName('revpdf:application:install')
            ->setDescription('Finish application install')
            ->addOption('import_samples', null, InputOption::VALUE_OPTIONAL, 'Import report samples', 'no')
            ->addOption('create_tables', null, InputOption::VALUE_OPTIONAL, 'Create SQL tables', 'no');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->baseDir = dirname(__FILE__) . '/../../..';

        $this->runCommands();

        if (strtolower($input->getOption('create_tables')) == 'yes') {
            $this->sqlFiles = array(
                $this->baseDir . '/resources/sql/schema.sql',
            );
        }

        if (strtolower($input->getOption('import_samples')) == 'yes') {
            $this->sqlFiles[] = $this->baseDir . '/resources/sql/examples.sql';
        }

        $output->writeln('<comment>Install::Start</comment>');
        $this->importFiles($this->sqlFiles, $output);
        $output->writeln('<comment>Install::End</comment>');
    }

    protected function runCommands()
    {
        $process = new Process('mkdir cache log web/assets/css  web/assets/js', $this->baseDir);
        $process->run();
        $process = new Process('chmod 777 cache log web/assets', $this->baseDir);
        $process->run();
    }

    /**
     * Import files
     *
     * @param array $files
     * @param $output
     */
    protected function importFiles(array $files, $output)
    {
        foreach ($files as $filepath) {
            $output->writeln(sprintf('Importing <comment>%s</comment>...', $filepath));
            $this->importFile($filepath, $output);
        }
    }

    /**
     * Import one file
     *
     * @param $filepath Complete path to file
     * @param $output
     *
     * @return int
     */
    protected function importFile($filepath, $output)
    {
        $command = $this->getApplication()
            ->find('dbal:import');
        $arguments = array(
            'command' => 'dbal:import',
            'file' => $filepath
        );
        $input = new ArrayInput($arguments);
        $result = $command->run($input, $output);

        return $result;
    }
}
