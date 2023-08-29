use records;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);


CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message_text TEXT,
    timestamp TIMESTAMP,
    image_id VARCHAR(255), 
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
select * from messages;


CREATE TABLE temporary_otp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 HOUR),
    UNIQUE KEY unique_username_phone (username, phone_number)
);

select * from temporary_otp;

INSERT INTO users (username, email) VALUES
  ('john_doe', 'john@example.com'),
  ('jane_smith', 'jane@example.com'),
  ('alice_wonderland', 'alice@example.com');
  
ALTER TABLE users
ADD COLUMN phone_no VARCHAR(20) unique;

ALTER TABLE users
ADD COLUMN password VARCHAR(255);

ALTER TABLE users
DROP COLUMN phone_no;

UPDATE users
SET phone_no = '7002672206'
WHERE id = 3;
  
select * from users;
delete from users where id=9;
select * from posts;

INSERT INTO posts (title, content, author_id) VALUES
  ('Getting Started with JavaScript', 'Learn the basics of JavaScript programming...', 1),
  ('CSS Styling Techniques', 'Discover advanced CSS styling techniques for your web projects...', 3),
  ('Node.js for Backend Development', 'Explore how Node.js can be used to build powerful backend systems...', 2),
  ('Database Design Principles', 'Learn about essential principles for designing effective databases...', 1), 
  ('Introduction to MySQL', 'In this post, we will explore the basics of MySQL...', 3),
  ('Creating REST APIs with Node.js', 'Learn how to build RESTful APIs using Node.js and Express...', 2),
  ('Web Development Best Practices', 'Discover essential best practices for modern web development...', 1);
  
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'records';

ALTER TABLE temporary_otp
ADD otp VARCHAR(6) NOT NULL;
ALTER TABLE temporary_otp
DROP INDEX unique_username_phone;

select * from temporary_otp;

INSERT INTO temporary_otp (username, phone_number,otp)
 VALUES ("sima","90101111","11111");
 
 SELECT otp FROM temporary_otp WHERE userName= "Du_bois" AND expires_at > NOW() ORDER BY created_at desc limit 1;
 
 DELETE FROM temporary_otp WHERE username="ganyu";