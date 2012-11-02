
CREATE TABLE IF NOT EXISTS `_r_invoice` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_firstname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_lastname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `customer_shipping_street_address` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_shipping_postcode` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_shipping_city` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_billing_street_address` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_billing_postcode` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customer_billing_city` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `invoice_net` float(18,2) DEFAULT NULL,
  `invoice_taxrate` float(18,2) DEFAULT NULL,
  `invoice_tax` float(18,2) DEFAULT NULL,
  `invoice_gross` float(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `_r_invoice_line` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `unit_cost` float(18,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `tax` float(18,2) NOT NULL,
  `total_price` float(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_id_idx` (`invoice_id`),
  CONSTRAINT `_r_invoice_line_invoice_id__r_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `_r_invoice` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS `_r_article` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `prixachat` float(18,2) DEFAULT NULL,
  `prixvente` float(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;




INSERT INTO `_r_invoice` VALUES (1,'Johnди','Doe','johndoe@helloworld.co','720 West Jefferson Street','40202','Louisville, Kentucky','720 West Jefferson Street','40202','Louisville, Kentucky','2012-05-01 11:19:20',3591.77,19.60,703.99,4295.76);
INSERT INTO `_r_invoice_line` VALUES (1,1,'CANON EOS 450D Kit 12.20Mpixels',500.00,5,490.00,2500.00),(2,1,'Western Digital Scorpio',152.49,2,59.78,304.98),(3,1,'PANASONIC Lumix DMC FZ28 Noir',281.89,1,55.25,281.89),(4,1,'Iomega Prestige Desktop',90.00,2,35.28,180.00),(5,1,'Traxdata EZ Drive YEGO 2',25.00,1,4.90,25.00),(6,1,'FUJIFILM FinePix J110W Noir - 10',119.90,1,23.50,119.90),(7,1,'Iomega Prestige Desktop 500 Go USB 2.0',90.00,2,35.28,180.00);

INSERT INTO `_r_article` VALUES (1,'PANASONIC Lumix DMC FZ28 Noir',100.00,281.89),(2,'SAMSUNG Spinpoint F1 - 1 To',50.00,89.50),(3,'SEAGATE Barracuda 7200.11',50.00,55.90),(4,'CANON Ixus 860IS Argent 8 Mpixel',50.00,189.90),(5,'PANASONIC Lumix DMC-TZ5 - 9.0 Mp',125.00,229.90),(6,'KODAK Easy Share C913 - 9.5 Mpix',20.00,69.00),(7,'FUJIFILM FinePix J110W Noir - 10',49.00,119.90),(8,'FUJIFILM FinePix F100fd - Noir',55.00,199.90),(9,'CANON EOS 450D Kit 12.20Mpixels',255.00,599.90),(10,'PANASONIC Lumix DMC-TZ4 - 8.0 Mp',165.00,189.90),(11,'PANASONIC Lumix DMC-FX37 Noir 10',135.00,212.90),(12,'CANON Powershot G10 14 Mpixels',86.00,129.00),(13,'MAXTOR Diamondmax 22 - 500 Go',50.00,55.90),(14,'WESTERN DIGITAL Caviar Green',50.00,99.90),(15,'WESTERN DIGITAL Caviar Green',50.00,56.49),(16,'SAMSUNG Spinpoint F1 - 750 Go',50.00,72.00),(17,'Iomega StorCenter ix2',150.00,300.00),(18,'LaCie Disque Dur 750 Go',75.00,120.00),(19,'Iomega Prestige Desktop',50.00,90.00),(20,'Emtec Movie Cube S120',100.00,200.00),(21,'Western Digital Scorpio',75.00,150.00),(22,'Traxdata EZ Drive YEGO 2',12.00,25.00),(23,'Iomega ScreenPlay Pro Multimedia Drive 1 To USB',120.00,250.00),(24,'Iomega eGo 250 Go USB 2.0',45.00,75.00),(25,'Iomega Prestige Desktop 500 Go USB 2.0',60.00,90.00),(26,'Western Digital Passport Essential 500 Go USB 2.0',120.00,139.00),(27,'Seagate FreeAgent Go 320 Go USB 2.0 Silver',75.00,100.00);

INSERT INTO `_r_report` VALUES 
(1,0,'ListeArticle','Liste des articles','RevPDF','RevPDF','RevPDF','RevPDF','fullpage','continuous','Tous les articles de la base de données','DB',NULL,'select * from _r_article order by id','ListeArticle.pdf','I','A4','P',10,10,10,10,'2006-05-25 06:30:00','2012-05-01 11:19:21'),
(2,0,'Lавel','Labels',NULL,NULL,NULL,NULL,'fullpage','continuous',NULL,'DB',NULL,'(select 1) union (select 2) union (select 3) union (select 4) union (select 5)','label.pdf','I','A4','P',10,10,10,10,'2009-06-03 14:56:59','2012-05-01 11:19:21'),
(3,0,'invoice / devis','Invoice','RevPDF','RevPDF, Invoice','Invoice','RevPDF - Invoice','fullpage','single','','DB',NULL,'select * from _r_invoice i left join _r_invoice_line il on i.id=il.invoice_id where i.id=1','Invoice.pdf','I','A4','P',10,10,10,10,'2009-10-09 10:51:08','2012-06-04 09:36:28');

INSERT INTO `_r_part` VALUES 
(1,1,5,'pageFooter',7,1,'FFFFFF',0,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(2,1,3,'details',40,1,'FFFFFF',0,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(3,1,1,'reportHeader',10,1,'FFFFFF',0,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(4,1,0,'pageHeader',20,1,'FFFFFF',1,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(5,2,3,'details',50,1,'FFFFFF',0,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(6,3,0,'pageHeader',80,1,'FFFFFF',1,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(7,3,5,'pageFooter',20,1,'FFFFFF',1,1,1,1,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(8,3,1,'reportHeader',15,1,'FFFFFF',0,0,0,0,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(9,3,3,'details',10,1,'FFFFFF',0,0,0,0,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21'),
(10,3,6,'reportFooter',50,1,'FFFFFF',0,0,0,0,'asc','2012-05-01 11:19:21','2012-05-01 11:19:21');


INSERT INTO `_r_element` VALUES (1,2,'TextZone','designation','text','FFFFFF','000000','LRBT',0.20,'helvetica',10,0,NULL,'L',0,0,40,100,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(2,4,'RoundedBox','Liste des articles','text','91B0FF','FF0000',NULL,0.20,'helvetica',12,0,'B','C',80,5,5,42,8,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(3,2,'TextZone','prixachat','number','FFFFFF','000000','LRBT',0.20,'helvetica',10,0,NULL,'R',100,0,40,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(4,2,'TextZone','prixvente','number','FFFFFF','000000','LRBT',0.20,'helvetica',10,0,NULL,'R',125,0,40,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(5,1,'PageNumber','Page {cur}/{nb}','text','FFFFFF','000000','0',0.20,'helvetica',12,0,NULL,'L',86,0,5,17,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(6,3,'TextField','Désignation','text','CCCCCC','000000','LRBT',0.20,'helvetica',10,0,'B','L',0,0,10,100,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(7,3,'TextField','Prix d\'achat','text','CCCCCC','000000','LRBT',0.20,'helvetica',10,0,'B','C',100,0,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(8,3,'TextField','Prix de vente','text','CCCCCC','000000','LRBT',0.20,'helvetica',10,0,'B','C',125,0,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(9,5,'TextField',NULL,'text','FFFFFF','000000','LRBT',0.20,'helvetica',12,0,NULL,'L',0,0,50,80,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(10,5,'TextField','Kirk','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,'B','L',44,8,6,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(11,5,'TextField','James','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,'B','L',29,8,6,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(12,5,'TextField','Capitaine','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',29,14,6,30,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(13,5,'TextField','Γειά σου κόσμος','text','FFFFFF','000000',NULL,0.20,'Deja Vu Sans',10,0,NULL,'L',29,19,6,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(14,5,'TextField','(617) 5552:1234','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',29,30,6,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(15,5,'TextField','jk@moon.com','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',29,36,6,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(16,5,'TextField','Boston, MA','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',29,24,6,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(17,5,'Image','/assets/img/icons/i18n/en_US.png','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,NULL,'L',19,8,5,8,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(18,5,'TextField',NULL,'text','FFFFFF','000000','LRBT',0.20,'helvetica',12,0,NULL,'L',110,0,50,80,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(19,5,'Image','/assets/img/icons/i18n/en_US.png','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,NULL,'L',127,8,5,8,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(20,5,'TextField','Boston Lobster Fishing','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',138,22,6,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(21,5,'TextField','James','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,'B','L',137,10,6,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(22,5,'TextField','Kirk','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,'B','L',154,10,6,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(23,5,'TextField','Capitaine','text','FFFFFF','000000',NULL,0.20,'times',10,0,'I','L',138,15,6,30,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(24,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',111,1,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(25,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',111,44,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(26,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',184,44,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(27,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',183,1,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(28,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',1,1,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(29,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',74,1,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(30,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',1,44,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(31,5,'TextField','J','text','FFFFFF','000000',NULL,0.20,'zapfdingbats',12,0,NULL,'C',74,44,5,5,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(32,6,'TextZone','customer_firstname','text','FFFFFF','000000','',0.20,'Deja Vu Sans',10,1,'','L',6,34,5,20,0,'2012-05-01 11:19:21','2012-05-02 18:10:23'),
(33,6,'TextZone','customer_lastname','text','FFFFFF','000000',NULL,0.20,'helvetica',10,1,NULL,'L',26,34,5,20,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(34,6,'TextZone','invoice_gross','text','FFFFFF','000000','',0.20,'helvetica',10,0,'','L',6,39,5,40,0,'2012-05-01 11:19:21','2012-05-25 10:27:42'),
(35,6,'TextField','Estimate','text','FFFFFF','696969','B',0.20,'helvetica',14,0,'','L',5,0,8,30,0,'2012-05-01 11:19:21','2012-05-02 18:10:23'),
(36,6,'TextZone','id','text','FFFFFF','696969','B',0.20,'helvetica',14,0,'','C',35,0,8,25,0,'2012-05-01 11:19:21','2012-05-25 10:27:42'),
(37,6,'TextZone','invoice_date','AbrevDate','FFFFFF','000000',NULL,0.20,'helvetica',12,0,NULL,'L',20,16,5,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(38,8,'TextField','DESCRIPTION','text','DFDFDF','000000','LRBT',0.20,'helvetica',12,0,'B','L',0,5,10,100,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(39,8,'TextField','QTY','text','DFDFDF','000000','LRBT',0.20,'helvetica',12,0,'B','C',100,5,10,10,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(40,9,'TextZone','quantity','text','FFFFFF','000000','LRBT',0.20,'helvetica',12,0,NULL,'C',100,0,10,10,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(41,9,'TextZone','total_price','number','FFFFFF','000000','LRBT',0.20,'helvetica',12,0,NULL,'R',135,0,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(42,8,'TextField','TOTAL','text','DFDFDF','000000','LRBT',0.20,'helvetica',12,0,'B','C',135,5,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(43,7,'PageNumber','Page {cur}/{nb}','text','FFFFFF','000000','T',0.20,'helvetica',12,0,NULL,'C',0,10,10,190,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(44,9,'TextZone','description','text','FFFFFF','0','LRBT',0.20,'helvetica',12,0,NULL,'L',0,0,10,100,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(45,8,'TextField','UNIT COST','text','DFDFDF','0','LRBT',0.20,'helvetica',12,0,'B','C',110,5,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(46,9,'TextZone','unit_cost','number','FFFFFF','0','LRBT',0.20,'helvetica',12,0,NULL,'R',110,0,10,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(47,10,'TextZone','invoice_net','number','FFFFFF','0','LRBT',0.20,'helvetica',12,0,NULL,'R',136,19,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(48,10,'TextZone','invoice_taxrate','number','DFDFDF','0','LRBT',0.20,'helvetica',12,0,NULL,'R',111,27,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(49,10,'TextZone','invoice_tax','number','FFFFFF','0','LRBT',0.20,'helvetica',12,0,NULL,'R',136,27,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(50,10,'TextField','Total:','text','FFFFFF','000000','T',0.50,'helvetica',12,0,'B','R',111,42,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(51,10,'TextField','Net:','text','DFDFDF','000000','LRBT',0.20,'helvetica',12,0,'B','R',111,19,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(52,6,'TextField','Customer information:','text','FFFFFF','000000','',0.20,'helvetica',14,0,'BU','L',6,25,6,65,0,'2012-05-01 11:19:21','2012-05-02 18:10:23'),
(53,10,'TextField','Tax:','text','DFDFDF','000000','LBT',0.20,'helvetica',12,0,'B','R',111,27,8,10,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(54,10,'TextZone','invoice_gross','text','FFFFFF','000000','T',0.50,'helvetica',12,0,NULL,'R',136,42,8,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(55,6,'TextZone','customer_billing_street_address','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',6,65,5,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(56,6,'TextField','Shipping address:','text','FFFFFF','000000','B',0.20,'helvetica',10,0,NULL,'L',98,60,5,35,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(57,6,'TextField','Billing address:','text','FFFFFF','000000','B',0.20,'helvetica',10,0,NULL,'L',6,60,5,30,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(58,6,'TextField','Date:','text','FFFFFF','000000',NULL,0.20,'helvetica',12,0,NULL,'L',5,16,5,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(59,6,'Image','/assets/img/revpdf_logo.png','text','FFFFFF','000000','LRBT',0.20,'helvetica',12,0,NULL,'L',140,0,20,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(60,6,'TextZone','customer_billing_postcode','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',6,70,5,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(61,6,'TextZone','customer_billing_city','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',21,70,5,25,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(62,6,'TextZone','customer_shipping_city','text','FFFFFF','000000','',0.20,'helvetica',10,0,'','L',113,70,5,25,0,'2012-05-01 11:19:21','2012-05-25 10:27:43'),
(63,6,'TextZone','customer_shipping_street_address','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',98,65,5,50,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(64,6,'TextZone','customer_shipping_postcode','text','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',98,70,5,15,0,'2012-05-01 11:19:21','2012-05-01 11:19:21'),
(65,2,'TextZone','designation','qrCode','FFFFFF','000000',NULL,0.20,'helvetica',10,0,NULL,'L',150,0,40,40,0,'2012-05-01 11:19:21','2012-05-01 11:19:21');
