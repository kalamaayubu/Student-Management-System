const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Creating an express app and setting port 
const app = express(); 
const port = 3000;

// Creating a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#1mysqlKalama',
    database: 'studentManagementSystem'
}); //db variable hold the database connection

// Connecting and checking the connection to the MySQL database
db.connect((err) => {
    if(err) throw err;
    console.log("Database connected");
});

// Middleware setup
app.use(express.static (__dirname)); // Serve static files from the same directory as server.js
app.use(express.json()); // Decode the JSON message into javascript objects 
app.use(express.urlencoded({extended: true})); // Decode the message of the URL encoding

// POST Route to add a new student record to the database
app.post('/addStudent', (req, res) => {
    const {name, age, grade} = req.body;
    const sql = 'INSERT INTO students(name, age, grade) VALUES (?, ?, ?)';
    db.query(sql, [name, age, grade], (err, result) => {
        if (err) {
            console.log('Error adding student', err);
            res.status(500).send('There was an error processing your request.'); //500 is server error
            return;
        }
        console.log('Student added successifully.')
        res.status(200).send('Student added successifully.')
    });
}); 

// GET route to fetch all student records from the database(studentManagementSystem) and passes it to the frontend
app.get(`/students`, (req, res) =>{
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, result) => {
        if(err) throw err; 
        res.json(result);
    });
}); 

// PUT route to update a student record in the database
app.put(`/editStudent/:id`, (req, res) => {
    const id = req.params.id;
    const { name, age, grade } = req.body;

    // SQL query to update the student record
    const sql = 'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?';
    db.query(sql, [name, age, grade, id], (err, result) => {
        if(err) {
            console.log('Error updating student ', err);
            res.status(500).send('There was an error processing your request.');
            return;
        }
        console.log('Student updated successifully.');
        res.status(200).send('Student updated successifully.');
    });
});

// DELETE route to delete a student
app.delete(`/deleteStudent/:id`, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if(err) throw err;
        console.log('Student removed successifully.');
        res.write('Student removed successifully.');
        return res.end();
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});