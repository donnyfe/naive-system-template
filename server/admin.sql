-- MySQL dump 10.13  Distrib 9.0.1, for macos13.7 (x86_64)
--
-- Host: localhost    Database: admin
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Current Database: `admin`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `admin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `admin`;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `chatId` varchar(255) NOT NULL,
  `chatName` varchar(255) NOT NULL DEFAULT '',
  `username` varchar(32) NOT NULL,
  `delFlag` tinyint NOT NULL DEFAULT '0' COMMENT '0 normal, 1 deleted',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`chatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES ('1e93dbc4-6179-45d8-af6b-7a3513134f62','你好','admin01',0,'2024-11-18 15:59:27.571000','2024-11-18 15:59:27.571000');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `messageId` varchar(36) NOT NULL DEFAULT '',
  `previousId` varchar(36) NOT NULL DEFAULT '',
  `chatId` varchar(36) NOT NULL DEFAULT '',
  `messageText` text,
  `completed` tinyint NOT NULL DEFAULT '0' COMMENT '1 completed, 0 not completed',
  `delFlag` tinyint NOT NULL DEFAULT '0' COMMENT '0 normal, 1 deleted',
  `sender` varchar(255) NOT NULL,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`messageId`),
  KEY `message_chat_id_foreign` (`chatId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES ('ba524474-ff4a-49e7-a12c-839d7c5d50db','f5e601d6-097e-49dc-8e3d-69c7b547bb87','1e93dbc4-6179-45d8-af6b-7a3513134f62','你好！我是零一万物开发的一个智能助手，我叫 Yi，我是由零一万物的研究人员们通过大量的文本数据进行训练，学习了语言的各种模式和关联，从而能够生成文本、回答问题以及进行其他与语言处理相关的任务。我可以帮助你解答问题，提供信息，或者进行简单的对话。有什么我可以帮助你的吗？',1,0,'assistant','2024-11-18 15:59:27.864000'),('f5e601d6-097e-49dc-8e3d-69c7b547bb87','','1e93dbc4-6179-45d8-af6b-7a3513134f62','你好',1,0,'user','2024-11-18 15:59:27.691000');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prompt`
--

DROP TABLE IF EXISTS `prompt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prompt` (
  `promptId` varchar(36) NOT NULL,
  `title` varchar(32) NOT NULL DEFAULT '',
  `content` varchar(1024) NOT NULL DEFAULT '',
  `username` varchar(32) NOT NULL DEFAULT '',
  `delFlag` tinyint NOT NULL DEFAULT '0' COMMENT '0 normal, 1 deleted',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`promptId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompt`
--

LOCK TABLES `prompt` WRITE;
/*!40000 ALTER TABLE `prompt` DISABLE KEYS */;
/*!40000 ALTER TABLE `prompt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `code` varchar(30) NOT NULL COMMENT '角色编码',
  `name` varchar(30) NOT NULL COMMENT '角色名称',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态:0-禁用,1-启用',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ee999bb389d7ac0fd967172c41` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_tasks`
--

DROP TABLE IF EXISTS `schedule_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_tasks` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `type` enum('cron','interval','timeout') NOT NULL DEFAULT 'cron',
  `expression` varchar(255) NOT NULL,
  `taskData` json NOT NULL,
  `status` enum('active','inactive','running','error') NOT NULL DEFAULT 'inactive',
  `lastRunTime` datetime DEFAULT NULL,
  `nextRunTime` datetime DEFAULT NULL,
  `retryCount` int NOT NULL DEFAULT '0',
  `maxRetries` int NOT NULL DEFAULT '3',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_tasks`
--

LOCK TABLES `schedule_tasks` WRITE;
/*!40000 ALTER TABLE `schedule_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upload`
--

DROP TABLE IF EXISTS `upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upload` (
  `uploadId` varchar(255) NOT NULL COMMENT '任务Id',
  `fileName` varchar(255) NOT NULL COMMENT '文件名',
  `filePath` varchar(255) NOT NULL COMMENT '文件路径',
  `url` varchar(255) NOT NULL COMMENT '文件地址',
  `size` int NOT NULL COMMENT '文件大小',
  `ext` varchar(255) DEFAULT NULL COMMENT '拓展名',
  PRIMARY KEY (`uploadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文件上传记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upload`
--

LOCK TABLES `upload` WRITE;
/*!40000 ALTER TABLE `upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(30) NOT NULL COMMENT '用户账号',
  `password` varchar(200) NOT NULL COMMENT '用户登录密码',
  `nickName` varchar(30) DEFAULT NULL COMMENT '用户昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `sex` char(1) DEFAULT NULL COMMENT '性别',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号码',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(50) DEFAULT NULL COMMENT '备注',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin01','$2a$10$p8J9DXTwGiXUGl6sU9OZGumV.fCEi6XNsZIEZLC2iFTyCzj6HU3.i',NULL,NULL,'0','18823456789','18823456789@qq.com',NULL,'2024-11-18 15:07:15.660884','2024-11-18 15:57:28.000000'),(2,'admin02','$2a$10$Q2UvWtMu3bjlp0ICat/xve6hnIkmcZXrNOA6JMGn73g7RBqgBt96G',NULL,NULL,'1','18812345678','18812345678@qq.com',NULL,'2024-11-18 15:56:49.127318','2024-11-18 15:57:02.000000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `FK_dba55ed826ef26b5b22bd39409b` (`roleId`),
  CONSTRAINT `FK_ab40a6f0cd7d3ebfcce082131fd` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_dba55ed826ef26b5b22bd39409b` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19  0:31:45
