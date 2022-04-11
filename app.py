from cmath import e
from copy import error
from flask_cors import CORS
from copyreg import constructor
import json
import sys
import time
from tokenize import String
from flask import Flask, request, jsonify
from importlib_metadata import email
import mysql.connector

app = Flask(__name__)
CORS(app)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Akshay@1234",
  port=3306,
  database="akshay"
)
cur = mydb.cursor()
try:
	userTable = cur.execute("CREATE TABLE  IF NOT EXISTS user(id int NOT NULL AUTO_INCREMENT,username VARCHAR(255), email VARCHAR(255), isAdmin boolean DEFAULT false, password VARCHAR(225), PRIMARY KEY (id))")
	print("created users table")
	projectTable = cur.execute("CREATE TABLE  IF NOT EXISTS projects(id int NOT NULL AUTO_INCREMENT,title VARCHAR(255), description VARCHAR(3000), timeline VARCHAR(225), assignedTo VARCHAR(200), PRIMARY KEY (id))")
	print("created project table")
except:
  print("Something else went wrong")


@app.route('/api/employees/list')
def index():
	cur = mydb.cursor(dictionary=True)
	cur.execute('''SELECT * FROM user WHERE isAdmin=false''')
	rv = cur.fetchall()
	for x in rv:
		print(x)
	mydb.commit()
	return str(rv)


@app.route('/api/login/admin',methods = ['POST'])
def login():
	email = request.json.get("email")
	password = request.json.get("password")
	if email is None or password is None:
		return {
			"message": "Email and password are required"
		}
	print(email,password)
	cur = mydb.cursor(dictionary=True)
	try:

		query = """SELECT * FROM user WHERE email=%s AND password=%s;"""
		cur.execute(query, (email, password))
		myresult = cur.fetchall()
		if len(myresult) == 0:
			return {
				"message": "Invalid Credentials"
			}

		return {
			"message": "Login Success",
			"data": myresult[0]
		}
	except error as e:
		print(error)
		return {
			"message": "Invalid Credentials"
		}



@app.route('/api/login/employee',methods = ['POST'])
def login1():
	email = request.json.get("email")
	password = request.json.get("password")
	if email is None or password is None:
		return {
			"message": "Email and password are required"
		}
	print(email,password)
	cur = mydb.cursor(dictionary=True)
	try:

		query = """SELECT * FROM user WHERE email=%s AND password=%s;"""
		print((email,password))
		cur.execute(query, (email, password))
		myresult = cur.fetchall()
		if len(myresult) == 0:
			return {
				"message": "Invalid Credentials"
			}

		return {
			"message": "Login Success",
			"data": myresult[0]
		}
	except error as e:
		print(error)
		return {
			"message": "Invalid Credentials"
		}


@app.route('/api/employee',methods = ['POST'])
def addemployee1():
	email = request.json.get("email")
	password = request.json.get("password")
	username = request.json.get("username")
	if email is None or password is None or username is None:
		return {
			"message": "Email,password and username are required to create an employee"
		}
	print(email,password,username)
	cur = mydb.cursor(dictionary=True)
	try:
		cur.execute('''INSERT into user(email,password,username)VALUES(%s,%s,%s)''',(email,password,username))
		mydb.commit()
		return {
			"message": "Created employee"
		}

	except:
		return {
			"message": "Cannot create employee"
		}


@app.route('/api/employee',methods = ['GET'])
def showEmployee():
	cur = mydb.cursor(dictionary=True)
	try:
		cur.execute('''SELECT id,email,password,username from user WHERE isAdmin=false''')
		myresult = cur.fetchall()
		results = myresult
		return {
			"message": "Fetched Employees",
			"data": results
		}
	except:
		return {
			"message": "Cannot fetch employee"
		}

@app.route('/api/project',methods = ['POST'])
def assignProject():
	title = request.json.get("title")
	description = request.json.get("description")
	timeline = request.json.get("timeline")
	assignedTo = request.json.get("assignedTo")
	if title is None or description is None or timeline is None or assignedTo is None:
		return {
			"message": "title,description, timeline and assignedTo are required to create an project"
		}
	print(title,description,timeline,assignedTo)
	cur = mydb.cursor(dictionary=True)
	try:
		cur.execute('''INSERT into projects(title,description,timeline,assignedTo)VALUES(%s,%s,%s,%s)''',(title,description,timeline,assignedTo))
		mydb.commit()
		return {
			"message": "Created Project"
		}

	except:
		print("some error occured", sys.exc_info())
		return {
			"message": "Cannot create project"
		}




@app.route('/api/project',methods = ['GET'])
def showProjects():
	cur = mydb.cursor(dictionary=True)
	try:
		cur.execute('''SELECT id,title,description,timeline,assignedTo from projects''')
		myresult = cur.fetchall()
		results = myresult
		return {
			"message": "Fetched Projects",
			"data": results
		}
	except:
		return {
			"message": "Cannot fetch projects"
		}

@app.route('/api/employee/project/<string:employeeId>',methods = ['GET'])
def showProjectofEmployee(employeeId):
	print("THE EMPPLOYYE",(employeeId))
	cur = mydb.cursor(dictionary=True)
	try:

		cur.execute("SELECT * FROM projects WHERE assignedTo= %s",(employeeId,))
		myresult = cur.fetchall()
		results = myresult
		if len(myresult) == 0:
			return {
				"message": "No Projects Found"
			}
		return {
			"message": "Fetched Projects",
			"data": results
		}
	except error as e:
		print(e)
		return {
			"message": "Cannot fetch projects"
		}


@app.route('/api/employee/project/edit/<string:employeeId>',methods = ['PUT'])
def editProjectofEmployee(employeeId):
	print("THE EMPPLOYYE",(employeeId))
	description = request.json.get("description")
	cur = mydb.cursor(dictionary=True)
	try:

		cur.execute("UPDATE projects SET description=%s WHERE id= %s",(description,employeeId,))
		mydb.commit()
		return {
			"message": "updated Project"
		}
	except error as e:
		print(e)
		return {
			"message": "Cannot update project"
		}


@app.route('/api/employee/project/delete/<employeeId>',methods = ['DELETE'])
def deleteProjectofEmployee(employeeId):
	print("THE EMPPLOYYE",(employeeId))
	# description = request.json.get("description")
	cur = mydb.cursor()
	try:
		print(type(employeeId))
		cur.execute("DELETE FROM projects WHERE id= %s",(employeeId,))
		mydb.commit()
		cur1 = mydb.cursor()
		cur1.execute('''SELECT id,title,description,timeline,assignedTo from projects''')
		myresult = cur1.fetchall()
		print(myresult)
		return {
			"message": "deleted Project"
		}
	except error as e:
		print(e)
		return {
			"message": "Cannot delete project"
		}


if __name__ == '__main__':
	app.run(debug=True)