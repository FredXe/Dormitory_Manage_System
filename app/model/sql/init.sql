/*
* Initial the sql Database
* !! ALERT: THIS SQL QUEUE WILL DROP ALL THE TABLES !!
*/

/*
* `UserID` 's data type should change to char(n).
*/

-- Set Database
USE dormitory;


-- CREATE tables
CREATE TABLE IF NOT EXISTS users
(
  `UserID` char(8) NOT NULL,
  `Password` char(60) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT 'default@example.host',
  `phnumber` char(10) NOT NULL,
  `sex` char(1) NOT NULL DEFAULT 'U',
  `eroll_year` YEAR NOT NULL,
  `createTS` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
);

CREATE TABLE IF NOT EXISTS houseMaster
(
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin
(
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student
(
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dormitory
(
  `d_name` varchar(30) NOT NULL,
  `adminUserID` char(8),
  `d_volume` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`d_name`),
  FOREIGN KEY (`adminUserID`) REFERENCES admin(`UserID`)  ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS room
(
  `d_name` varchar(30) NOT NULL,
  `r_number` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `r_volume` INT NOT NULL,
  `r_cost` INT NOT NULL,
  PRIMARY KEY (`r_number`, `d_name`),
  FOREIGN KEY (`d_name`) REFERENCES dormitory(`d_name`)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS equipment
(
  `e_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `e_type` INT NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  `e_condition` varchar(60) NOT NULL,
  `r_number` INT UNSIGNED,
  `d_name` varchar(30),
  PRIMARY KEY (`e_ID`),
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES room(`r_number`, `d_name`)  ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bulletinBoard
(
  `b_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `b_text` VARCHAR(2000) NOT NULL,
  PRIMARY KEY (`b_ID`)
);

CREATE TABLE IF NOT EXISTS application
(
  `studentUserID` CHAR(8) NOT NULL,
  `a_semester` YEAR NOT NULL,
  `a_Date` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
  `approveTS` TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `a_approved` CHAR(1) NOT NULL DEFAULT 'U',
  `a_Paid` CHAR(1) NOT NULL DEFAULT 'U',
  `adminUserID` CHAR(8) DEFAULT NULL,
  PRIMARY KEY (`studentUserID`),
  FOREIGN KEY (`studentUserID`) REFERENCES student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`adminUserID`) REFERENCES admin(`UserID`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comment
(
  `c_No` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `b_ID` INT UNSIGNED NOT NULL,
  `c_text` VARCHAR(256) NOT NULL,
  `UserID` CHAR(8) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEdit` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`c_No`, `b_ID`),
  FOREIGN KEY (`b_ID`) REFERENCES bulletinBoard(`b_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manage_HD
(
  `UserID` char(8) NOT NULL,
  `d_name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`UserID`, `d_name`),
  FOREIGN KEY (`UserID`) REFERENCES houseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`d_name`) REFERENCES dormitory(`d_name`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manage_HB
(
  `b_ID` INT UNSIGNED NOT NULL,
  `h_UserID` char(8) NOT NULL,
  PRIMARY KEY (`b_ID`),
  FOREIGN KEY (`b_ID`) REFERENCES bulletinBoard(`b_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`h_UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boarder
(
  `UserID` char(8) NOT NULL,
  `d_name` VARCHAR(30) NOT NULL,
  `r_number` INT UNSIGNED NOT NULL,
  `adminUserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`d_name`, `r_number`) REFERENCES room(`d_name`, `r_number`) ON DELETE CASCADE,
  FOREIGN KEY (`adminUserID`) REFERENCES admin(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nonBoarder
(
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES student(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS violationRecord
(
  `v_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserID` char(8) NOT NULL,
  `v_date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `v_type` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`v_ID`, `UserID`),
  FOREIGN KEY (`UserID`) REFERENCES boarder(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manage_HV
(
  `H_UserID` char(8) NOT NULL,
  `v_ID` INT UNSIGNED NOT NULL,
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`H_UserID`, `v_ID`, `UserID`),
  FOREIGN KEY (`H_UserID`) REFERENCES houseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`v_ID`, `UserID`) REFERENCES violationRecord(`v_ID`, `UserID`) ON DELETE CASCADE
);

SHOW TABLES;
