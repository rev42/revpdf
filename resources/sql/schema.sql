CREATE TABLE IF NOT EXISTS `_r_report` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `is_private` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `short_name` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `keywords` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `subject` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display_mode_zoom` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display_mode_layout` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_type` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_location` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_value` text COLLATE utf8_unicode_ci,
  `filename` text COLLATE utf8_unicode_ci,
  `file_destination` text COLLATE utf8_unicode_ci,
  `paper_format` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `page_orientation` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `top_margin` tinyint(3) unsigned NOT NULL,
  `bottom_margin` tinyint(3) unsigned NOT NULL,
  `right_margin` tinyint(3) unsigned NOT NULL,
  `left_margin` tinyint(3) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `_r_part` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `weight` tinyint(3) unsigned NOT NULL,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `height` int(10) unsigned NOT NULL,
  `is_visible` tinyint(3) unsigned DEFAULT NULL,
  `color` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_page_jump` tinyint(3) unsigned DEFAULT NULL,
  `is_indivisible` tinyint(3) unsigned DEFAULT NULL,
  `is_auto_extend` tinyint(3) unsigned DEFAULT NULL,
  `is_auto_reduc` tinyint(3) unsigned DEFAULT NULL,
  `sort_order` varchar(4) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `report_id_idx` (`report_id`),
  CONSTRAINT `_r_part_report_id__r_report_id` FOREIGN KEY (`report_id`) REFERENCES `_r_report` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `_r_element` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `part_id` bigint(20) unsigned NOT NULL,
  `type` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `field` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `format` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `fill_color` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `text_color` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `border` varchar(4) COLLATE utf8_unicode_ci DEFAULT NULL,
  `border_width` float(18,2) NOT NULL,
  `font_family` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `size` tinyint(3) unsigned DEFAULT NULL,
  `is_auto_extend` tinyint(3) unsigned DEFAULT NULL,
  `style` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alignment` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `posx` smallint(5) unsigned DEFAULT NULL,
  `posy` smallint(5) unsigned DEFAULT NULL,
  `height` smallint(5) unsigned DEFAULT NULL,
  `width` smallint(5) unsigned DEFAULT NULL,
  `zindex` smallint(5) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `part_id_idx` (`part_id`),
  CONSTRAINT `_r_element_part_id__r_part_id` FOREIGN KEY (`part_id`) REFERENCES `_r_part` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `_r_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `firstname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mail` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `confirmation_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `roles` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `signupProvider` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

