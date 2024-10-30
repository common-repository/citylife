<?php
/*
Plugin Name: WP CityLife
Plugin URI: http://www.citylifeapp.com
Description: The easiest way to include CityLife in your website. Create some custom discover feeds with the channels you want.
Version: 1.0.3
Author: CityLife
Author URI: http://www.citylifeapp.com
*/

error_reporting(0);
global $wpcl_current_channel_url;

/**
 * ADMIN
 */

add_action('admin_enqueue_scripts', 'wpcl_loadadmin_script' );
add_action('admin_menu', 'wpcl_admin_menu');

function wpcl_loadadmin_script() {
    wp_enqueue_script(
        'wp-admin-citylife-js',
        plugins_url( '/js/wp-citylife.js' , __FILE__ ),
        array( 'jquery' )
    );
}

function wpcl_admin_menu() {
    add_menu_page('WP CityLife', 'CityLife', 'manage_options', 'wp-citylife-menu', 'wpcl_menu_discover_overview_page', plugins_url( '/images/map_app_small.png' , __FILE__ ) );
}

function wpcl_menu_discover_overview_page() {
    ?>
    <div class="wrap">
        <div id='icon-edit' class='icon32 icon32-posts-post'>&nbsp;</div><h2>Available Channels</h2>
        <div id="wpcl-admin-container"></div>
        <script type="text/javascript">
            if ('undefined' == typeof window.jQuery) 
                document.getElementById('wpcl-container').innerHTML = 'Error: In order for WP CityLife to work, jQuery must be installed. A check was done and jQuery was not present.';

            jQuery(function ($) {
                citylife.getChannels('#wpcl-admin-container');
            });
        </script>
    </div>
    <?php
}

/**
 * FRONTEND
 */

add_filter( 'widget_text', 'do_shortcode' );
add_shortcode('cl-channel', 'wpcl_channel_renderer');
add_shortcode('cl-button', 'wpcl_button_renderer');
add_action('wp_enqueue_scripts', 'wpcl_loadfront_script');

function wpcl_channel_renderer( $atts ) {
    extract( shortcode_atts( array(
        'id'  => '1'
    ), $atts ) );

    $unique_id = randomId(15);

    return "
        <div id='".$unique_id."' class='wpcl-channel-container row'>
            <script>
                jQuery(function(){
                    citylife.channelView('#".$unique_id."', '".$atts['id']."');
                });
            </script>
        </div>
    ";
}

function wpcl_button_renderer( $atts ) {
    extract( shortcode_atts( array(
        'id'  => '1',
        'url' => '/'
    ), $atts ) );

    $unique_id = randomId(15);
    
    return "
        <div id='".$unique_id."'>
            <script>
                jQuery(function(){
                    citylife.buttonView('#".$unique_id."', '".$atts['id']."', '".$atts['url']."');
                });
            </script>
        </div>
    ";
}


function wpcl_loadfront_script() {
    wp_enqueue_script(
        'wp-citylife-js',
        plugins_url( '/js/wp-citylife.js' , __FILE__ ),
        array( 'jquery' )
    );

    wp_enqueue_style(
        'wp-citylife-css',
        plugins_url( '/css/wp-citylife.css' , __FILE__ )
    );
}


function randomId($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return "wpcl-container-".$randomString;
}