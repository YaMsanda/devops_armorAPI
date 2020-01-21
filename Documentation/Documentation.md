API Armor Documentation - Devops
======
### Class of Ynov Informatique B3 2019-2020 - Groupe 5

-----

<br/>
<br/>

## Summary:
### 1. Project presentation
### 2. Data Model architecture
### 3. Routing architecture

<br/>
<br/>

## 1. Project presentation

This project's objective from a development point of view is to have a NodeJs server with a side returning html as the user interface and an API side, the two of them have the same features.
These features are the following :
The server will be connected to a MySQL database and will have to interact with it as the user interacts with the API or the web interface.
The objective is to be able to create, edit, delete and view armors and armor parts.

An armor has 5 parts : torso, arms, legs, cape and helmet.
For this project we will be using the following technologies and tools :
* NodeJs as the server environment
* ExpressJs from npm as the router
* Pug from npm as the view renderer
* Multer from npm to be able to parse the form-data arguments in the request
* Mysql from npm to be able to connect to the database from the server
* MySQL as the database server 

<br/>

## 2. Data Model architecture

Our Data Model is the following

![Data model schema](datamodel.png "MCD - Data model schema")

We have the central table "armor", wich contains only its "armor_id".
Then, we have a table for each armor part, they all have the same 3 fields : 
* name : 	a string for the part's name (ex: Viking helmet)
* color : 	a string for the part's color (ex: Red)
* defense : an int for the part's defense score (ex: 50)

Because of their relation with the armor table, each of the parts will have an external field armor_id, allowing us to gather all of the parts to have a complete armor.

![Data model schema](datamodel2.png "MPD - Data model schema")

<br/>

## 3. Routing architecture

Our routing architecture is the following :
* "/api/" is the part of our server who will be open to GET, POST, PUT and DELETE HTTP requests.

* "/ihm/" is the part of our server who will be open to GET HTTP request only, the forms will then send the requests to the API on submit.


On the API side, the endpoints including the url parameters for each request type will be : 
* "/api/:part/:id" will be used for GET, POST and DELETE HTTP requests.

* "/api/:part" will be used for PUT HTTP requests.

For the PUT and POST we will be using the form-data method to provide the additionnal parameters :
* PUT : 
    * "armor_id" : int
	* "name" : string
	* "color" : string
	* "defense" : int
* POST : 
	* "name" : string
	* "color" : string
	* "defense" : int

Finally, to start this server, the nginx server will have to execute "npm start" that will trigger "node server.js"