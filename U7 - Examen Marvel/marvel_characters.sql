CREATE DATABASE IF NOT EXISTS `dwec` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dwec`;

CREATE TABLE `marvel_characters`
(
  `id` varchar(1024) NOT NULL,
  `name` varchar(1024),
  `modified` varchar(1024),
  `path` varchar(1024),
  CONSTRAINT id PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;