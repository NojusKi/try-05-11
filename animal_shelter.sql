-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: animal_shelter
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption_requests`
--

DROP TABLE IF EXISTS `adoption_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address` text,
  `experience` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pet_user` (`pet_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `adoption_requests_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `adoption_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_requests`
--

LOCK TABLES `adoption_requests` WRITE;
/*!40000 ALTER TABLE `adoption_requests` DISABLE KEYS */;
INSERT INTO `adoption_requests` VALUES (1,14,2,'pending','because she matches my mood','2025-05-07 20:58:33','2025-05-07 20:58:33',NULL,NULL),(2,6,3,'pending','because I need sun in my life','2025-05-08 09:15:45','2025-05-08 09:15:45',NULL,NULL);
/*!40000 ALTER TABLE `adoption_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `description` text,
  `image_url` text,
  `status` enum('available','pending','adopted') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gender` varchar(10) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (1,'Berta','dog','Boxer',8,'Active, Friendly','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Boxer_bringe.jpg/500px-Boxer_bringe.jpg','available','2025-05-05 21:25:11','2025-05-05 21:25:11','female','large'),(3,'Kliunkis','cat','unknown',16,'A little oldie catty. Veryyy friendly','https://upload.wikimedia.org/wikipedia/commons/4/4c/Blackcat-Lilith.jpg','available','2025-05-05 21:28:23','2025-05-07 15:20:36','male','small'),(4,'Butter','dog','Golden Retriever',5,'Friendly, Active, ','https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/golden-retriever-dog-breed-info.jpeg','available','2025-05-07 14:46:51','2025-05-07 14:46:51','male','large'),(5,'Sir White SnowBall','cat','mixed',4,'Majestic soul trapped in a cat','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuk3238sBhbFbMckKPeDL1Vy1FAZmBuD0IZg&s','available','2025-05-07 14:48:06','2025-05-07 14:48:06','male','medium'),(6,'Sunshine','dog','Buldog',7,'Likes to bite into things and bark at butterflies','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfLy3g7LaYeuqNftkuAbv0VItgMfiTDDDq2Q&s','pending','2025-05-07 14:51:37','2025-05-08 09:15:45','female','medium'),(7,'Kortis','cat','Munchkin',4,'Likes to sleep with Sunshine and to be caressed','https://www.thesprucepets.com/thmb/L94SEuF6rMZWL1o37dd8wU550L0=/4974x0/filters:no_upscale():strip_icc()/munchkin-cat-relaxing-in-the-garden-johannesburg-667587109-57d9bb0f5f9b5865168d616a.jpg','available','2025-05-07 14:54:39','2025-05-07 14:54:39','male','medium'),(8,'Lucy','dog','Pembroke Welsh Corgi',5,'likes to chase ball','https://upload.wikimedia.org/wikipedia/commons/9/99/Welsh_Pembroke_Corgi.jpg','available','2025-05-07 14:57:24','2025-05-07 14:57:24','male','small'),(9,'Garfildas','cat','unknown',8,'Steals food while you are not looking','https://upload.wikimedia.org/wikipedia/commons/8/88/American_bobtail_2.jpg','available','2025-05-07 15:00:21','2025-05-07 15:00:21','male','medium'),(11,'Patty and Selma','cat','Havana Brown',2,'The one on the right is Patty and on the left is Selma','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Havana_kittens.jpg/1200px-Havana_kittens.jpg','available','2025-05-07 15:03:40','2025-05-07 15:18:26','female','small'),(12,'Buckis','dog','Havanese dog',1,'Likes to give kisses','https://simplysouthernpups.com/azure/southerndogclub/pups/Havanese%20Dog.jpg?w=557&h=557&mode=crop&autorotate=1','available','2025-05-07 15:05:31','2025-05-07 15:05:31','male','small'),(13,'Tigre','cat','unknown',3,'likes to look outside the window at people','https://www.boredpanda.com/blog/wp-content/uploads/2023/04/Cpuz4CnIX6Q-png__700.jpg','available','2025-05-07 15:07:39','2025-05-07 15:07:39','female','medium'),(14,'Morning','cat','unknown',1,'not a morning cat','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjsOkeW5JZdliv0nEoD7RS0P1yLlozf0997w&s','pending','2025-05-07 15:09:31','2025-05-07 20:58:33','male','small'),(15,'Emo','dog','unknown',6,'like to listen to rock music','https://www.caninejournal.com/wp-content/uploads/Chinese-Crested-Hairless-Dog-1024x569.jpg','available','2025-05-07 15:11:48','2025-05-07 15:11:48','male','small'),(16,'Auksaplauke','dog','unknown',2,'dog which saw Tagled','https://townsquare.media/site/942/files/2021/06/GettyImages-52192187.jpg','available','2025-05-07 15:16:04','2025-05-07 15:19:37','female','small');
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nojus','nojus@gm.com','$2a$10$sdEjeuW70dfbhYhwJ8nIRurPrwPifzNeTx15DUZ/ii6w3wSSJ2fSK','admin','2025-04-28 22:50:25','2025-05-03 22:14:07'),(2,'Nojsu ki','test@gm.com','$2a$10$Bqii2bnrkit0koDLaNazleDtUU38ZFXoELythdQ2mb3nZ/bRM6OBK','admin','2025-05-03 22:04:32','2025-05-03 23:33:46'),(3,'testas','testas@gm.com','$2a$10$VHkNytC8BJr8t06QGb.dpOZIzr4CmMHY3J8uwK0Oj8L6nzpG6EH8.','user','2025-05-07 21:59:55','2025-05-07 21:59:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-11 18:28:16
