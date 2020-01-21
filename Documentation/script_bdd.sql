#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: armor
#------------------------------------------------------------

CREATE TABLE armor(
        armor_Id Int NOT NULL
	,CONSTRAINT armor_PK PRIMARY KEY (armor_Id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: helmet
#------------------------------------------------------------

CREATE TABLE helmet(
        armor_Id Int NOT NULL ,
        name     Varchar (30) NOT NULL ,
        color    Varchar (30) NOT NULL ,
        defense  Int NOT NULL
	,CONSTRAINT helmet_PK PRIMARY KEY (armor_Id)

	,CONSTRAINT helmet_armor_FK FOREIGN KEY (armor_Id) REFERENCES armor(armor_Id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: torso
#------------------------------------------------------------

CREATE TABLE torso(
        armor_Id Int NOT NULL ,
        name     Varchar (30) NOT NULL ,
        color    Varchar (30) NOT NULL ,
        defense  Int NOT NULL
	,CONSTRAINT torso_PK PRIMARY KEY (armor_Id)

	,CONSTRAINT torso_armor_FK FOREIGN KEY (armor_Id) REFERENCES armor(armor_Id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: arms
#------------------------------------------------------------

CREATE TABLE arms(
        armor_Id Int NOT NULL ,
        name     Varchar (30) NOT NULL ,
        color    Varchar (30) NOT NULL ,
        defense  Int NOT NULL
	,CONSTRAINT arms_PK PRIMARY KEY (armor_Id)

	,CONSTRAINT arms_armor_FK FOREIGN KEY (armor_Id) REFERENCES armor(armor_Id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: legs
#------------------------------------------------------------

CREATE TABLE legs(
        armor_Id Int NOT NULL ,
        name     Varchar (30) NOT NULL ,
        color    Varchar (30) NOT NULL ,
        defense  Int NOT NULL
	,CONSTRAINT legs_PK PRIMARY KEY (armor_Id)

	,CONSTRAINT legs_armor_FK FOREIGN KEY (armor_Id) REFERENCES armor(armor_Id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: cape
#------------------------------------------------------------

CREATE TABLE cape(
        armor_Id Int NOT NULL ,
        name     Varchar (30) NOT NULL ,
        color    Varchar (30) NOT NULL ,
        defense  Int NOT NULL
	,CONSTRAINT cape_PK PRIMARY KEY (armor_Id)

	,CONSTRAINT cape_armor_FK FOREIGN KEY (armor_Id) REFERENCES armor(armor_Id)
)ENGINE=InnoDB;

