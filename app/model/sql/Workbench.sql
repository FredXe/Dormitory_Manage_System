CREATE USER 'admin'@'%' IDENTIFIED BY 'a1095500';
GRANT ALL PRIVILEGES ON `dormitory`.* TO 'admin';
SHOW DATABASES;
use dormitory;
SHOW TABLES;
DESCRIBE Users;
DESCRIBE Admin;
DESCRIBE HouseMaster;
DESCRIBE Student;
SELECT * FROM `Users`;
SELECT * FROM `Student`;
DELETE FROM Users WHERE UserID='fortest' AND Password='test';
DELETE FROM Student WHERE UserID='fortest';
INSERT INTO Users VALUES ('test', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019);
INSERT INTO `Student` VALUES ('test', 'a1095500');
INSERT INTO Users VALUES ('testAdmin', 'csie', 'Cindy', 'test@example.com', '0912345678', 'F', 2019);
INSERT INTO `Admin` VALUES ('testAdmin');
SELECT `UserID` `account`, `privilege` FROM `Users` WHERE `UserID`='fred' AND `Password`='test';
SELECT (CASE WHEN UserID IN (SELECT UserID FROM `Student`) THEN 'Student'
WHEN UserID IN (SELECT UserID FROM `HouseMaster`) THEN 'HouseMaster'
WHEN UserID IN (SELECT UserID FROM `Admin`) THEN 'Admin'
ELSE 'Unknown' END) AS privilege FROM `Users` WHERE `UserID`='testAdmin' AND `Password`='csie';

SELECT (CASE WHEN U.UserID IN (SELECT U.UserID FROM `Student`) THEN 'Student'
                        WHEN U.UserID IN (SELECT UserID FROM `HouseMaster`) THEN 'HouseMaster'
                        WHEN U.UserID IN (SELECT UserID FROM `Admin`) THEN 'Admin'
                        ELSE 'Unknown' END) AS privilege, a_ID FROM `Users` AS U LEFT JOIN `Student` AS S ON U.UserID = S.UserID WHERE U.`UserID`='testAdmin' AND `Password`='csie';

SELECT `UserID` `123` FROM Users;
CREATE DATABASE dormitory;
SELECT * FROM Users WHERE UserID='test' AND Password='csie';
HELP 'datatypes';
DESCRIBE Application;

