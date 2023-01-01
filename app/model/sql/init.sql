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
  `Password` varchar(80) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT 'default@example.host',
  `phnumber` char(10) NOT NULL,
  `sex` char(1) NOT NULL DEFAULT 'N',
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
  `a_ID` CHAR(10) NOT NULL UNIQUE KEY,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dormitory
(
  `d_name` varchar(30) NOT NULL,
  `UserID` char(8),
  `d_volume` INT NOT NULL,
  PRIMARY KEY (`d_name`),
  FOREIGN KEY (`UserID`) REFERENCES admin(`UserID`)  ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS room
(
  `d_name` varchar(30) NOT NULL,
  `r_number` INT NOT NULL,
  `r_volume` INT NOT NULL,
  `r_cost` INT NOT NULL,
  PRIMARY KEY (`r_number`, `d_name`),
  FOREIGN KEY (`d_name`) REFERENCES dormitory(`d_name`)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS equipment
(
  `e_ID` char(10) NOT NULL,
  `e_condition` varchar(60) NOT NULL,
  `e_type` INT NOT NULL,
  `r_number` INT,
  `d_name` varchar(30),
  PRIMARY KEY (`e_ID`),
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES room(`r_number`, `d_name`)  ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bulletinBoard
(
  `b_text` varchar(2000) NOT NULL,
  `b_ID` char(10) NOT NULL,
  PRIMARY KEY (`b_ID`)
);

CREATE TABLE IF NOT EXISTS application
(
  `a_ID` CHAR(10) NOT NULL,
  `a_semester` YEAR NOT NULL,
  `a_Date` DATETIME NOT NULL,
  `a_approved` CHAR(1) NOT NULL DEFAULT 'N',
  `a_Paid` CHAR(1) NOT NULL DEFAULT 'N',
  `UserID` char(8),
  PRIMARY KEY (`a_ID`),
  FOREIGN KEY (`a_ID`) REFERENCES student(`a_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`UserID`) REFERENCES admin(`UserID`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chat
(
  `c_No` CHAR(10) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  `c_text` varchar(256) NOT NULL,
  `UserID` char(8) NOT NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEdit` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`c_No`, `b_ID`),
  FOREIGN KEY (`b_ID`) REFERENCES bulletinBoard(`b_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`UserID`) REFERENCES admin(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS editChat
(
  `UserID` char(8) NOT NULL,
  `c_No` CHAR(10) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  `editTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`, `c_No`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`c_No`, `b_ID`) REFERENCES chat(`c_No`, `b_ID`) ON DELETE CASCADE
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
  `UserID` char(8) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  PRIMARY KEY (`UserID`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES houseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`b_ID`) REFERENCES bulletinBoard(`b_ID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boarder
(
  `UserID` char(8) NOT NULL,
  `r_number` INT NOT NULL,
  `d_name` char(8) NOT NULL,
  `Admin_UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES room(`r_number`, `d_name`) ON DELETE CASCADE,
  FOREIGN KEY (`Admin_UserID`) REFERENCES admin(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS non_Boarder
(
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES student(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS violation_Record
(
  `v_ID` CHAR(10) NOT NULL,
  `UserID` char(8) NOT NULL,
  `v_date` DATE NOT NULL,
  `v_type` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`v_ID`, `UserID`),
  FOREIGN KEY (`UserID`) REFERENCES boarder(`UserID`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manage_HV
(
  `H_UserID` char(8) NOT NULL,
  `v_ID` CHAR(10) NOT NULL,
  `UserID` char(8) NOT NULL,
  PRIMARY KEY (`H_UserID`, `v_ID`, `UserID`),
  FOREIGN KEY (`H_UserID`) REFERENCES houseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`v_ID`, `UserID`) REFERENCES violation_Record(`v_ID`, `UserID`) ON DELETE CASCADE
);


SHOW TABLES;
