<?php

use SilexAssetic\AsseticServiceProvider;

// Assetic asset management library
// If enabled , it compresses CSS using the YUI compressor and compresses
// Javascript using the YUI compressor
// Puts altogether css files / js files

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


$app->register(new SilexAssetic\AsseticServiceProvider());

// Location where to dump all generated files
$app['assetic.path_to_web'] = __DIR__ . '/../web/assets';

// An associative array of assetic options.
$app['assetic.options'] = array('debug' => true, 'auto_dump_assets' => true);

// Instance of FilterManager for adding filters (implements FilterInterface)
$app['assetic.filter_manager'] = $app->share(
    $app->extend(
        'assetic.filter_manager',
        function($fm, $app) {
            $fm->set(
                'yui_css',
                new Assetic\Filter\Yui\CssCompressorFilter(
                    $app['assetic.filter.yui_compressor.path']
                )
            );
            $fm->set('yui_js',
                new Assetic\Filter\Yui\JsCompressorFilter(
                    $app['assetic.filter.yui_compressor.path']
                )
            );

            return $fm;
        })
);

// Instance of AssetManager for adding assets (implements AssetInterface)
$app['assetic.asset_manager'] = $app->share(
    $app->extend(
        'assetic.asset_manager',
        function($am, $app) {
            $am->set(
                'styles',
                new Assetic\Asset\AssetCache(
                    new Assetic\Asset\GlobAsset(
                        $app['assetic.input.path_to_css'],
                        array($app['assetic.filter_manager']->get('yui_css'))
                    ),
                    new Assetic\Cache\FilesystemCache($app['assetic.path_to_cache'])
                )
            );
            $am->get('styles')->setTargetPath($app['assetic.output.path_to_css']);

            $am->set(
                'scripts', new Assetic\Asset\AssetCache(
                    new Assetic\Asset\GlobAsset(
                        $app['assetic.input.path_to_js'],
                        array($app['assetic.filter_manager']->get('yui_js'))
                    ),
                    new Assetic\Cache\FilesystemCache($app['assetic.path_to_cache'])
                )
            );
            $am->get('scripts')->setTargetPath($app['assetic.output.path_to_js']);

            return $am;
        })
);