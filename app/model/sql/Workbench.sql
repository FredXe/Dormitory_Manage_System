CREATE USER 'admin'@'%' IDENTIFIED BY 'a1095500';
GRANT ALL PRIVILEGES ON `dormitory`.* TO 'admin';
SHOW DATABASES;
use dormitory;
SHOW TABLES;
DESCRIBE users;
DESCRIBE Admin;
DESCRIBE HouseMaster;
DESCRIBE Student;
SELECT * FROM `users`;
SELECT * FROM `student`;
SELECT * FROM `houseMaster`;
DELETE FROM Users WHERE UserID='fortest' AND Password='test';
INSERT INTO users (UserID, Password, name, email, phnumber, sex, eroll_year) VALUES ('test', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019);
INSERT INTO `houseMaster` VALUES ('test');
INSERT INTO users VALUES ('a1095500', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019, 123);
UPDATE users SET sex='D' WHERE UserID = 'a1095500';
DELETE FROM users WHERE UserID = 'a1095532';
DELETE FROM student WHERE UserID='a1095500';
INSERT INTO `Admin` VALUES ('testAdmin');
SELECT `UserID` `account`, `privilege` FROM `Users` WHERE `UserID`='fred' AND `Password`='test';
SELECT (CASE WHEN UserID IN (SELECT UserID FROM `Student`) THEN 'Student'
WHEN UserID IN (SELECT UserID FROM `HouseMaster`) THEN 'HouseMaster'
WHEN UserID IN (SELECT UserID FROM `Admin`) THEN 'Admin'
ELSE 'Unknown' END) AS privilege FROM `Users` WHERE `UserID`='testAdmin' AND `Password`='csie';

ALTER TABLE bulletinBoard AUTO_INCREMENT=1;
SELECT * FROM bulletinBoard NATURAL JOIN manage_HB;
SELECT * FROM bulletinBoard;
SELECT * FROM manage_HB;
SELECT * FROM comment;
UPDATE comment SET c_text='workbench test comment' WHERE c_NO=1 AND b_ID=1;
INSERT INTO bulletinBoard (title, b_text) VALUE ('TEST TITLE', '123:D');
INSERT INTO bulletinBoard (b_ID, b_text) VALUE (12, '123:D');
INSERT INTO manage_HB (b_ID, h_UserID) VALUE ((SELECT LAST_INSERT_ID() FROM bulletinBoard), (SELECT UserID FROM houseMaster WHERE UserID='test' UNION SELECT UserID FROM admin WHERE UserID='test'));
SELECT LAST_INSERT_ID() FROM bulletinBoard;
DELETE FROM bulletinBoard WHERE b_ID<20;
DELETE FROM manage_HB WHERE b_ID < 20;
SELECT *, (CASE WHEN U.UserID IN (SELECT UserID FROM `student`) THEN 'student'
                        WHEN U.UserID IN (SELECT UserID FROM `houseMaster`) THEN 'houseMaster'
                        WHEN U.UserID IN (SELECT UserID FROM `admin`) THEN 'admin'
                        ELSE 'Unknown' END) AS privilege FROM `users` AS U LEFT JOIN `student` AS S ON U.`UserID` = S.`UserID`;

SET GLOBAL time_zone = 'Asia/Taipei';

SELECT (CASE WHEN U.UserID IN (SELECT U.UserID FROM `Student`) THEN 'Student'
                        WHEN U.UserID IN (SELECT UserID FROM `HouseMaster`) THEN 'HouseMaster'
                        WHEN U.UserID IN (SELECT UserID FROM `Admin`) THEN 'Admin'
                        ELSE 'Unknown' END) AS privilege, a_ID FROM `Users` AS U LEFT JOIN `Student` AS S ON U.UserID = S.UserID WHERE U.`UserID`='testAdmin' AND `Password`='csie';

SELECT `UserID` `123` FROM Users;
CREATE DATABASE dormitory;
SELECT * FROM Users WHERE UserID='test' AND Password='csie';
HELP 'datatypes';
DESCRIBE Application;


-- DROP all tables before create
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE if EXISTS users,
	houseMaster,
	admin,
	dormitory,
	room,
	equipment,
	bulletinBoard,
	application,
	comment,
	manage_HD,
	manage_HB,
	student,
	boarder,
	non_Boarder,
	violation_Record,
	manage_HV;
SET FOREIGN_KEY_CHECKS = 1;
