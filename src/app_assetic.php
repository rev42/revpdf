<?php

use SilexAssetic\AsseticServiceProvider;

// Assetic asset management library
// If enabled , it compresses CSS using the YUI compressor and compresses
// Javascript using the YUI compressor
// Puts altogether css files / js files
$app->register(
    new AsseticServiceProvider(), array(
        'assetic.options' => array(
            'debug' => $app['debug'],
            'auto_dump_assets' => true
        ),
        'assetic.filters' => $app->protect(
            function($fm) use ($app) {
                $fm->set(
                    'yui_css', new Assetic\Filter\Yui\CssCompressorFilter(
                        $app['assetic.filter.yui_compressor.path']
                    )
                );
                $fm->set(
                    'yui_js', new Assetic\Filter\Yui\JsCompressorFilter(
                        $app['assetic.filter.yui_compressor.path']
                    )
                );
            }
        ),
        'assetic.assets' => $app->protect(
            function($am, $fm) use ($app) {
                $am->set(
                    'styles', new Assetic\Asset\AssetCache(
                        new Assetic\Asset\GlobAsset(
                            $app['assetic.input.path_to_css'],
                            array($fm->get('yui_css'))
                        ),
                        new Assetic\Cache\FilesystemCache($app['assetic.path_to_cache'])
                    )
                );
                $am->get('styles')->setTargetPath($app['assetic.output.path_to_css']);

                $am->set(
                    'scripts', new Assetic\Asset\AssetCache(
                        new Assetic\Asset\GlobAsset(
                            $app['assetic.input.path_to_js'],
                            array($fm->get('yui_js'))
                        ),
                        new Assetic\Cache\FilesystemCache($app['assetic.path_to_cache'])
                    )
                );
                $am->get('scripts')->setTargetPath($app['assetic.output.path_to_js']);
            }
        )
    )
);

// Assetic
$app['assetic.path_to_cache']       = $app['cache.path'] . DIRECTORY_SEPARATOR . 'assetic' ;
$app['assetic.path_to_web']         = __DIR__ . '/../web/assets';

$app['assetic.input.path_to_assets']    = __DIR__ . '/../resources/assets';
$app['assetic.input.path_to_themes']    = $app['assetic.input.path_to_assets'] . DIRECTORY_SEPARATOR . 'css/themes';

if (!is_dir($app['assetic.input.path_to_themes'] . DIRECTORY_SEPARATOR . $theme)) {
    $theme = 'default';
}

$app['assetic.input.path_to_css']       = array(
    $app['assetic.input.path_to_assets'] . '/css/themes/'.$theme.'/*.css',
    $app['assetic.input.path_to_assets'] . '/css/*.css',
);
$app['assetic.output.path_to_css']      = '/css/styles.css';
$app['assetic.input.path_to_js']        = array(
    $app['assetic.input.path_to_assets'] . '/js/*.js',
    $app['assetic.input.path_to_assets'] . '/js/revpdf/*.js',
);
$app['assetic.output.path_to_js']       = '/js/scripts.js';

