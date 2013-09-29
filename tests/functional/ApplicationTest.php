<?php

use Silex\WebTestCase;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

class ApplicationTest extends WebTestCase
{
    public function createApplication()
    {
        // Silex
        $this->app = require __DIR__.'/../../src/app.php';

        // Tests mode
        $this->app['debug'] = true;
        unset($this->app['exception_handler']);
        $app['translator.messages'] = array();

        // Use FilesystemSessionStorage to store session
        $this->app['session.storage'] = $this->app->share(function() {
            return new MockFileSessionStorage(sys_get_temp_dir());
        });

        // Controllers
        require __DIR__ . '/../../src/controllers.php';

        return $app;
    }

    /**
     * Homepage without locale redirects to default locale homepage 
     */
    public function testHomepage()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/');
        $this->assertEquals(302, $client->getResponse()->getStatusCode());
    }
    
    /**
     * French homepage 
     */
    public function testFrHomepage()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/fr/');

        $this->assertTrue($client->getResponse()->isOk());
    }
    
    /**
     * English homepage 
     */
    public function testEnHomepage()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/en/');

        $this->assertTrue($client->getResponse()->isOk());
    }
    
    /**
     * Add report webpage 
     */
    public function testReportAdd()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/en/Report/add');

        $this->assertTrue($client->getResponse()->isOk());
    }
    
    
    /**
     * Edit report webpage 
     */
    public function testReportEdit()
    {
        $client = $this->createClient();
        $crawler = $client->request('GET', '/en/Report/edit/1');

        $this->assertTrue($client->getResponse()->isOk());
    }
}