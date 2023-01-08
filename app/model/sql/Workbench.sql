CREATE USER 'admin'@'%' IDENTIFIED BY 'a1095500';
GRANT ALL PRIVILEGES ON `dormitory`.* TO 'admin';
SHOW DATABASES;
use dormitory;
SHOW TABLES;
DESCRIBE users;
DESCRIBE Admin;
DESCRIBE HouseMaster;
DESCRIBE dormitory;
DESCRIBE room;
DESCRIBE equipment;
DESCRIBE violationRecord;
DESCRIBE manage_HV;
DESCRIBE application;
DESCRIBE nonBoarder;
DESCRIBE boarder;

SELECT * FROM `users`;
SELECT * FROM `student`;
SELECT * FROM `houseMaster`;
SELECT * FROM `dormitory`;
SELECT * FROM `room`;
SELECT * FROM `bulletinBoard`;
SELECT * FROM `comment`;
SELECT * FROM `manage_HD`;
SELECT * FROM `equipment`;
SELECT * FROM `violationRecord`;
SELECT * FROM `manage_HV`;
SELECT * FROM `application`;
SELECT * FROM `boarder`;
SELECT * FROM `nonBoarder`;
SELECT * FROM ``;

SHOW CREATE TABLE application;
ALTER TABLE application ADD  FOREIGN KEY (`d_name`) REFERENCES room(`d_name`) ON DELETE CASCADE;
ALTER TABLE application ADD COLUMN `d_name` VARCHAR(30) NOT NULL;
SELECT r_number, d_name, COUNT(r_number) FROM boarder GROUP BY r_number, d_name HAVING COUNT(r_number) < 4;
SELECT r_number AS roomNum FROM room WHERE d_name = 'Node test Dormitory';
SELECT LAST_INSERT_ID() FROM violationRecord LIMIT 1;
INSERT INTO violationRecord (UserID, v_type) VALUE ('a1095532', 'haha type');
INSERT INTO manage_HV 
				VALUE ('a1095511', 
				(SELECT LAST_INSERT_ID() FROM violationRecord LIMIT 1), 
				'a1095532');
DELETE FROM violationRecord WHERE v_ID < 50;
ALTER TABLE violationRecord AUTO_INCREMENT=1;
ALTER TABLE application ADD COLUMN `approveTS` TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE application MODIFY COLUMN `adminUserID` CHAR(8) DEFAULT NULL;
ALTER TABLE boarder MODIFY COLUMN `d_name` VARCHAR(30) NOT NULL;
ALTER TABLE non_Boarder RENAME nonBoarder;
ALTER TABLE manage_HV DROP FOREIGN KEY v_ID;
ALTER TABLE violationRecord MODIFY COLUMN `v_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE application MODIFY COLUMN `a_Date` DATETIME NOT NULL DEFAULT (CURRENT_DATE);
DELETE FROM boarder WHERE UserID='a1095532';
DELETE FROM nonBoarder WHERE UserID='a1095532';
DELETE FROM application WHERE studentUserID='a1095532';
DELETE FROM equipment WHERE e_ID< 300;
DELETE FROM dormitory WHERE d_name='Node test Dormitory';
ALTER TABLE dormitory RENAME COLUMN UserID TO adminUserID;
ALTER TABLE room MODIFY COLUMN `r_number` INT UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE equipment AUTO_INCREMENT=1;
ALTER TABLE boarder DROP COLUMN `r_number`;
ALTER TABLE equipment RENAME COLUMN `name` TO `e_name`;
DELETE FROM Users WHERE UserID='fortest' AND Password='test';
INSERT INTO users (UserID, Password, name, email, phnumber, sex, eroll_year) VALUES ('test', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019);
INSERT INTO `houseMaster` VALUES ('test');
INSERT INTO users VALUES ('a1095500', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019, 123);
UPDATE users SET sex='D' WHERE UserID = 'a1095500';
DELETE FROM users WHERE UserID = 'a1095532';
DELETE FROM student WHERE UserID='a1095500';
INSERT INTO `Admin` VALUES ('testAdmin');
SELECT e_ID AS ID, e_condition AS `condition`, e_type AS type,
		r_number AS roomNumber, d_name AS dormitoryName
		FROM equipment;
DELETE FROM equipment WHERE e_ID<50;
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
SELECT *, (CASE WHEN UserID IN (SELECT UserID FROM `student`) THEN 'student'
                        WHEN UserID IN (SELECT UserID FROM `houseMaster`) THEN 'houseMaster'
                        WHEN UserID IN (SELECT UserID FROM `admin`) THEN 'admin'
                        ELSE 'Unknown' END) AS privilege FROM `users`;

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
DROP TABLE boarder;
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
	violationRecord,
	manage_HV;
SET FOREIGN_KEY_CHECKS = 1;
