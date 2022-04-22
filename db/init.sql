DROP DATABASE IF EXISTS connect_app;
CREATE DATABASE connect_app;
USE connect_app;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE PROCEDURE register_user(_username VARCHAR(255), _password TEXT, OUT id INT) BEGIN
  INSERT INTO users (username, password) VALUES (_username, _password);
  SET id = LAST_INSERT_ID();
END //

DELIMITER ;