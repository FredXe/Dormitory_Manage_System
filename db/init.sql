/*
* Initial the sql Database
* !! ALERT: THIS SQL QUEUE WILL DROP ALL THE TABLES !!
*/

/*
* `UserID` 's data type should change to char(n).
*/

-- Set Database
USE dormitory;

-- DROP all tables before create
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE if EXISTS Users,
	HouseMaster,
	Admin,
	Dormitory,
	Room,
	Equipment,
	Bulletin_Board,
	Application,
	Chat,
	manage_HD,
	manage_HB,
	Student,
	Boarder,
	Non_Boarder,
	Violation_Record,
	manage_HV,
	edit;
SET FOREIGN_KEY_CHECKS = 1;

-- CREATE tables
CREATE TABLE Users
(
  `UserID` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL DEFAULT '',
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT 'default@example.host',
  `phnumber` char(10) NOT NULL,
  `sex` char(1) NOT NULL DEFAULT 'N',
  `eroll_year` INT NOT NULL,
  `privilege` char(1) NOT NULL DEFAULT 'G',
  PRIMARY KEY (`UserID`)
);

CREATE TABLE HouseMaster
(
  `UserID` varchar(30) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE Admin
(
  `UserID` varchar(30) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`) ON DELETE CASCADE
);

CREATE TABLE Dormitory
(
  `d_name` varchar(30) NOT NULL,
  `UserID` varchar(30),
  `d_volume` INT NOT NULL,
  PRIMARY KEY (`d_name`),
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`)  ON DELETE SET NULL
);

CREATE TABLE Room
(
  `d_name` varchar(30) NOT NULL,
  `r_number` INT NOT NULL,
  `r_volume` INT NOT NULL,
  `r_cost` INT NOT NULL,
  PRIMARY KEY (`r_number`, `d_name`),
  FOREIGN KEY (`d_name`) REFERENCES Dormitory(`d_name`)  ON DELETE CASCADE
);

CREATE TABLE Equipment
(
  `e_ID` char(10) NOT NULL,
  `e_condition` varchar(60) NOT NULL,
  `e_type` INT NOT NULL,
  `r_number` INT,
  `d_name` varchar(30),
  PRIMARY KEY (`e_ID`),
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES Room(`r_number`, `d_name`)  ON DELETE SET NULL
);

CREATE TABLE Bulletin_Board
(
  `b_text` TEXT NOT NULL,
  `b_ID` char(10) NOT NULL,
  PRIMARY KEY (`b_ID`)
);

CREATE TABLE Application
(
  `a_ID` CHAR(10) NOT NULL,
  `a_semester` YEAR NOT NULL,
  `a_Date` DATETIME NOT NULL,
  `a_approved` CHAR(1) NOT NULL DEFAULT 'N',
  `a_Paid` CHAR(1) NOT NULL DEFAULT 'N',
  `UserID` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`a_ID`),
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`) ON DELETE CASCADE
);

CREATE TABLE Chat
(
  `c_No` CHAR(10) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  `c_text` TINYTEXT NOT NULL,
  `UserID` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`c_No`, `b_ID`),
  FOREIGN KEY (`b_ID`) REFERENCES Bulletin_Board(`b_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`) ON DELETE CASCADE
);

CREATE TABLE manage_HD
(
  `UserID` VARCHAR(30) NOT NULL,
  `d_name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`UserID`, `d_name`),
  FOREIGN KEY (`UserID`) REFERENCES HouseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`d_name`) REFERENCES Dormitory(`d_name`) ON DELETE CASCADE
);

CREATE TABLE manage_HB
(
  `UserID` VARCHAR(30) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  PRIMARY KEY (`UserID`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES HouseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`b_ID`) REFERENCES Bulletin_Board(`b_ID`) ON DELETE CASCADE
);

CREATE TABLE Student
(
  `UserID` VARCHAR(30) NOT NULL,
  `a_ID` CHAR(10),
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`a_ID`) REFERENCES Application(`a_ID`) ON DELETE SET NULL
);

CREATE TABLE Boarder
(
  `B_UserID` VARCHAR(30) NOT NULL,
  `r_number` INT NOT NULL,
  `d_name` VARCHAR(30) NOT NULL,
  `A_UserID` VARCHAR(30),
  PRIMARY KEY (`B_UserID`),
  FOREIGN KEY (`B_UserID`) REFERENCES Student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES Room(`r_number`, `d_name`) ON DELETE CASCADE,
  FOREIGN KEY (`A_UserID`) REFERENCES Admin(`UserID`) ON DELETE SET NULL
);

CREATE TABLE Non_Boarder
(
  `UserID` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Student(`UserID`) ON DELETE CASCADE
);

CREATE TABLE Violation_Record
(
  `v_ID` CHAR(10) NOT NULL,
  `UserID` VARCHAR(30) NOT NULL,
  `v_date` DATE NOT NULL,
  `v_type` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`v_ID`, `UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Boarder(`B_UserID`) ON DELETE CASCADE
);

CREATE TABLE manage_HV
(
  `H_UserID` VARCHAR(30) NOT NULL,
  `v_ID` CHAR(10) NOT NULL,
  `UserID` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`H_UserID`, `v_ID`, `UserID`),
  FOREIGN KEY (`H_UserID`) REFERENCES HouseMaster(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`v_ID`, `UserID`) REFERENCES Violation_Record(`v_ID`, `UserID`) ON DELETE CASCADE
);

CREATE TABLE edit
(
  `UserID` varchar(30) NOT NULL,
  `c_No` CHAR(10) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  PRIMARY KEY (`UserID`, `c_No`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES Student(`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`c_No`, `b_ID`) REFERENCES Chat(`c_No`, `b_ID`) ON DELETE CASCADE
);

SHOW TABLES;
