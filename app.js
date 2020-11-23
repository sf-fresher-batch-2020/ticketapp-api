const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const TOKEN_SECRET = "7bc78545b1a3923cc1e1e19523fd5c3f20b409509";
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000


const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_URL || "localhost",
    port: 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "ticketapp_db",
    connectionLimit: 1
});

// Routes
//users
app.post('/api/users', createUser);
app.get('/api/users', getAllUsers);
app.post('/api/users/login', login);

//tickets
app.post('/api/tickets', createTicket);
app.get('/api/tickets', getAllTickets);
app.get('/api/tickets/:id', getTicket);
// Functions
async function createUser(req, res) {
    let user = req.body;
    let params = [user.name, user.email, user.password,user.role];
    const result = await pool.query("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)", params);
    let id = result[0].insertId; 
    res.status(200).json({id: id});
}

async function getAllUsers(req, res) {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result[0]);
}

async function login(req, res) {
    const user = req.body;
    let params = [user.email,user.password];
    console.log(params);
    const result = await pool.query("SELECT id, name, email,role FROM users WHERE email = ? and password= ?", params);
    const users= result[0];
    if (users.length ==0){
        throw new Error("Invalid Login Credentials");
      }
    res.status(201).json(users[0]);
}
// Ticket Function
async function createTicket(req, res) {
    const ticket = req.body;
    let params = [ticket.title, ticket.priority,ticket.department,ticket.description,ticket.mobileNumber,ticket.createdBy,ticket.teamAssigned];
    const result = await pool.query("INSERT INTO tickets (title,priority,department,description,mobile_number, created_by, team_assign) VALUES (?,?,?,?,?,?,?)", params);
    res.status(201).json({ id: result[0].insertId });
}

async function getAllTickets(req, res) {
    const result = await pool.query("SELECT * FROM tickets");
    res.status(200).json(result[0]);
}
 // Create Commmon Error Handler
 app.use(function (err, req, res, next) {
    console.log("common error handler")
    console.error(err);
    res.json({errorMessage:err.message});
})

async function getTicket(req, res) {
    const id = req.params.id;
    let params = [id];
    console.log(params);
    const result = await pool.query("SELECT *FROM users WHERE id = ?", params);
    const users= result[0];
    if (users.length ==0){
        throw new Error("Invalid Ticket Id");
      }
    res.status(201).json(users[0]);
}

app.get("/", (req, res) => res.send({ message: "REST API Service is working" }));

app.listen(port, () => console.log(`Example app listening on port!`, port));
