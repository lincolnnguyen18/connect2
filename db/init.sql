DROP DATABASE IF EXISTS connect_app;
CREATE DATABASE connect_app;
USE connect_app;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  requester_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE PROCEDURE register_user(_username VARCHAR(255), _password TEXT, OUT id INT) BEGIN
  INSERT INTO users (username, password) VALUES (_username, _password);
  SET id = LAST_INSERT_ID();
END //

CREATE PROCEDURE get_users_to_friend(_id INT, _username VARCHAR(255)) BEGIN
  SELECT username FROM users WHERE id != _id AND
    username LIKE CONCAT('%', _username, '%') AND
    NOT EXISTS (SELECT * FROM friend_requests WHERE
      (requester_id = _id AND recipient_id = users.id) OR
      (requester_id = users.id AND recipient_id = _id)
    );
END //

CREATE PROCEDURE send_friend_request(_requester_id INT, _recipient_id INT) BEGIN
  INSERT INTO friend_requests (requester_id, recipient_id) VALUES (_requester_id, _recipient_id);
END //

DELIMITER ;