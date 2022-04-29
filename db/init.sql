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
  FOREIGN KEY (requester_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE (requester_id, recipient_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
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

CREATE PROCEDURE send_friend_request(_requester_id INT, _recipient_username VARCHAR(255)) BEGIN
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  INSERT INTO friend_requests (requester_id, recipient_id) VALUES (_requester_id, @recipient_id);
END //

CREATE PROCEDURE cancel_friend_request(_requester_username VARCHAR(255), _recipient_username VARCHAR(255)) BEGIN
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  SET @requester_id = (SELECT id FROM users WHERE username = _requester_username);
  DELETE FROM friend_requests WHERE requester_id = @requester_id AND recipient_id = @recipient_id;
  DELETE FROM messages WHERE sender_id = @requester_id AND recipient_id = @recipient_id;
  DELETE FROM messages WHERE sender_id = @recipient_id AND recipient_id = @requester_id;
END //

CREATE PROCEDURE accept_friend_request(_recipient_id INT, _requester_username VARCHAR(255)) BEGIN
  SET @requester_id = (SELECT id FROM users WHERE username = _requester_username);
  UPDATE friend_requests SET accepted_at = CURRENT_TIMESTAMP WHERE recipient_id = _recipient_id AND requester_id = @requester_id;
END //

CREATE PROCEDURE delete_friend(_id INT, _friend_username VARCHAR(255)) BEGIN
  SET @friend_id = (SELECT id FROM users WHERE username = _friend_username);
  DELETE FROM friend_requests WHERE requester_id = @friend_id AND recipient_id = _id;
  DELETE FROM friend_requests WHERE requester_id = _id AND recipient_id = @friend_id;
  DELETE FROM messages WHERE sender_id = @friend_id AND recipient_id = _id;
  DELETE FROM messages WHERE sender_id = _id AND recipient_id = @friend_id;
END //

CREATE PROCEDURE get_friend_requests(_id INT) BEGIN
  SELECT users.username, friend_requests.accepted_at, IF(friend_requests.requester_id = _id, 'requester', 'recipient') AS direction FROM users INNER JOIN friend_requests ON
    (friend_requests.requester_id = users.id AND friend_requests.recipient_id = _id) OR
    (friend_requests.requester_id = _id AND friend_requests.recipient_id = users.id)
  ORDER BY friend_requests.id DESC;
END //

CREATE PROCEDURE send_message(_sender_username VARCHAR(255), _recipient_username VARCHAR(255), _body TEXT) BEGIN
  SET @sender_id = (SELECT id FROM users WHERE username = _sender_username);
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  INSERT INTO messages (sender_id, recipient_id, body) VALUES (@sender_id, @recipient_id, _body);
END //

CREATE PROCEDURE get_messages_offset(_sender_id INT, _recipient_username CHAR(255), _limit INT, _offset INT, _timezone_offset_hours INT, _timezone_offset_minutes INT) BEGIN
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  SELECT messages.id, messages.body, CONVERT_TZ(messages.created_at,'-5:00', CONCAT(_timezone_offset_hours, ':', _timezone_offset_minutes)) AS created_at, IF(messages.sender_id = _sender_id, 'sender', 'recipient') AS direction FROM messages WHERE
    ((messages.sender_id = _sender_id AND messages.recipient_id = @recipient_id) OR
    (messages.sender_id = @recipient_id AND messages.recipient_id = _sender_id))
    AND messages.id > _offset
    ORDER BY messages.id DESC
    LIMIT _limit;
END //

CREATE PROCEDURE get_messages_offset_reverse(_sender_id INT, _recipient_username CHAR(255), _limit INT, _offset INT, _timezone_offset_hours INT, _timezone_offset_minutes INT) BEGIN
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  SELECT messages.id, messages.body, CONVERT_TZ(messages.created_at,'-5:00', CONCAT(_timezone_offset_hours, ':', _timezone_offset_minutes)) AS created_at, IF(messages.sender_id = _sender_id, 'sender', 'recipient') AS direction FROM messages WHERE
    ((messages.sender_id = _sender_id AND messages.recipient_id = @recipient_id) OR
    (messages.sender_id = @recipient_id AND messages.recipient_id = _sender_id))
    AND messages.id < _offset
    ORDER BY messages.id DESC
    LIMIT _limit;
END //

CREATE PROCEDURE get_messages(_sender_id INT, _recipient_username CHAR(255), _limit INT, _timezone_offset_hours INT, _timezone_offset_minutes INT) BEGIN
  SET @recipient_id = (SELECT id FROM users WHERE username = _recipient_username);
  SELECT messages.id, messages.body, CONVERT_TZ(messages.created_at,'-5:00', CONCAT(_timezone_offset_hours, ':', _timezone_offset_minutes)) AS created_at, IF(messages.sender_id = _sender_id, 'sender', 'recipient') AS direction FROM messages WHERE
    (messages.sender_id = _sender_id AND messages.recipient_id = @recipient_id) OR
    (messages.sender_id = @recipient_id AND messages.recipient_id = _sender_id)
    ORDER BY messages.id DESC
    LIMIT _limit;
END //

DELIMITER ;