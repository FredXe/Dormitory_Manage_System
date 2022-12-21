/*
* `UserID` 's data type should change to char(n).
* `c_No`, `b_ID` are AUTO INCREMENT.
*/

CREATE TABLE Users
(
  `UserID` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL DEFAULT '',
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT 'default@example.host',
  `phnumber` char(10) NOT NULL,
  `sex` char(1) NOT NULL DEFAULT 'N',
  `eroll_year` INT NOT NULL,
  PRIMARY KEY (`UserID`)
);

DROP TABLE Users;
SHOW TABLES;
DESCRIBE Users;
SELECT * FROM TABLES;

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
  FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
);

CREATE TABLE Dormitory
(
  `d_name` varchar(30) NOT NULL,
  `UserID` varchar(30) NOT NULL,
  `d_volume` INT NOT NULL,
  PRIMARY KEY (`d_name`),
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`)
);

CREATE TABLE Room
(
  `d_name` varchar(30) NOT NULL,
  `r_number` INT NOT NULL,
  `r_volume` INT NOT NULL,
  `r_cost` INT NOT NULL,
  PRIMARY KEY (`r_number`, `d_name`),
  FOREIGN KEY (`d_name`) REFERENCES Dormitory(`d_name`)
);

CREATE TABLE Equipment
(
  `e_ID` char(10) NOT NULL,
  `e_condition` varchar(60) NOT NULL,
  `e_type` INT NOT NULL,
  `r_number` INT,
  `d_name` varchar(30),
  PRIMARY KEY (`e_ID`),
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES Room(`r_number`, `d_name`)
);

CREATE TABLE Bulletin_Board
(
  `b_text` TEXT NOT NULL,
  `b_ID` char(10) NOT NULL AUTO_INCREMENT,
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
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`)
);

CREATE TABLE Chat
(
  `c_No` CHAR(10) NOT NULL AUTO_INCREMENT,
  `b_ID` CHAR(10) NOT NULL,
  `c_text` TINYTEXT NOT NULL,
  `UserID` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`c_No`, `b_ID`),
  FOREIGN KEY (`b_ID`) REFERENCES Bulletin_Board(`b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES Admin(`UserID`)
);

CREATE TABLE manage_HD
(
  `UserID` VARCHAR(30) NOT NULL,
  `d_name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`UserID`, `d_name`),
  FOREIGN KEY (`UserID`) REFERENCES HouseMaster(`UserID`),
  FOREIGN KEY (`d_name`) REFERENCES Dormitory(`d_name`)
);

CREATE TABLE manage_HB
(
  `UserID` VARCHAR(30) NOT NULL,
  `b_ID` CHAR(10) NOT NULL,
  PRIMARY KEY (`UserID`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES HouseMaster(`UserID`),
  FOREIGN KEY (`b_ID`) REFERENCES Bulletin_Board(`b_ID`)
);

CREATE TABLE Student
(
  `UserID` VARCHAR(30) NOT NULL,
  `a_ID` CHAR(10),
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`),
  FOREIGN KEY (`a_ID`) REFERENCES Application(`a_ID`)
);

CREATE TABLE Boarder
(
  `B_UserID` VARCHAR(30) NOT NULL,
  `r_number` INT NOT NULL,
  `d_name` INT NOT NULL,
  `A_UserID` INT NOT NULL,
  PRIMARY KEY (`B_UserID`),
  FOREIGN KEY (`B_UserID`) REFERENCES Student(`UserID`),
  FOREIGN KEY (`r_number`, `d_name`) REFERENCES Room(`r_number`, `d_name`),
  FOREIGN KEY (`A_UserID`) REFERENCES Admin(`UserID`)
);

CREATE TABLE Non_Boarder
(
  `UserID` INT NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Student(`UserID`)
);

CREATE TABLE Violation_Record
(
  `v_date` INT NOT NULL,
  `v_type` INT NOT NULL,
  `v_ID` INT NOT NULL,
  `UserID` INT NOT NULL,
  PRIMARY KEY (`v_ID`, `UserID`),
  FOREIGN KEY (`UserID`) REFERENCES Boarder(`B_UserID`)
);

CREATE TABLE manage_HV
(
  `H_UserID` INT NOT NULL,
  `v_ID` INT NOT NULL,
  `UserID` INT NOT NULL,
  PRIMARY KEY (`H_UserID`, `v_ID`, `UserID`),
  FOREIGN KEY (`H_UserID`) REFERENCES HouseMaster(`serID`),
  FOREIGN KEY (`v_ID`, `UserID`) REFERENCES Violation_Record(`v_ID`, `UserID`)
);

CREATE TABLE edit
(
  `UserID` varchar(30) NOT NULL,
  `c_No` INT NOT NULL,
  `b_ID` INT NOT NULL,
  PRIMARY KEY (`UserID`, `c_No`, `b_ID`),
  FOREIGN KEY (`UserID`) REFERENCES Student(`UserID`),
  FOREIGN KEY (`c_No`, `b_ID`) REFERENCES Chat(`c_No`, `b_ID`)
);