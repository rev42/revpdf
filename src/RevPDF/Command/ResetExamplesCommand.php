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

use Symfony\Component\Finder\Finder;
use Symfony\Component\Process\Process;

class ResetExamplesCommand extends Command
{
    protected $sqlFiles = array();

    protected function configure()
    {
        $this
            ->setName('revpdf:application:reset')
            ->setDescription('Reset examples');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('<comment>Reset::Start</comment>');
        $this->baseDir = dirname(__FILE__) . '/..';

        $this->executeSql("SET FOREIGN_KEY_CHECKS=0", $output);
        $this->executeSql("TRUNCATE TABLE `_r_report`", $output);
        $this->executeSql("TRUNCATE TABLE `_r_part`", $output);
        $this->executeSql("TRUNCATE TABLE `_r_element`", $output);
        $this->executeSql("TRUNCATE TABLE `_r_invoice_line`", $output);
        $this->executeSql("TRUNCATE TABLE `_r_invoice`", $output);
        $this->executeSql("TRUNCATE TABLE `_r_article`", $output);
        $this->executeSql("SET FOREIGN_KEY_CHECKS=1", $output);

        $this->sqlFiles[] = $this->baseDir . '/resources/sql/examples.sql';
        $output->writeln('<comment>Importing SQL files...</comment>');
        $this->importFiles($this->sqlFiles, $output);
        $output->writeln('<comment>Reset::End</comment>');
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

    protected function executeSql($sqlCommand, $output)
    {
        $command = $this->getApplication()
            ->find('dbal:run-sql');
        $arguments = array(
            'command' => 'dbal:run-sql',
            'sql' => $sqlCommand
        );
        $input = new ArrayInput($arguments);
        $result = $command->run($input, $output);

        return $result;
    }
}