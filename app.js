const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null, "log/profile_images");
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadProfile = multer({storage: storage});

app.set("views", "log");
app.set("view engine", "ejs");

app.use(session({
    secret: 'cKf8GdDhtgQ',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended:true}));

//Database connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "sia"
});

app.get("/", (req,res) => {
    app.use(express.static('notlog'));
    res.sendFile(__dirname + "/notlog/index.html");
});

// Redirect to "select.html" in the "signup" directory
app.get("/signup", (req, res) => {
    app.use(express.static('signup'));
    res.sendFile(__dirname + '/signup/select.html');
});

//Post in provider signup form
app.post('/provider_submit', (req, res) => {
    if (!req.body) {
        res.status(400).send("Bad request. No request data found.");
        return;
    }

    const fname = req.body.fname;
    const lname = req.body.lname;
    const age = req.body.age;
    const gender = req.body.gender;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const email = req.body.email;
    const profile = "provider";
    const profileimg = "profile_icon.png";

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send("Database connection error: " + err.message);
            return;
        }

        const sql = "INSERT INTO provider (fname, lname, age, gender, username, password, address, email, profile, profileimg) VALUES (?,?,?,?,?,?,?,?,?,?);";

        connection.query(sql, [fname, lname, age, gender, username, password, address, email, profile, profileimg], (err, result) => {
            connection.release();

            if (err) {
                res.status(500).send("Error inserting data: " + err.message);
                return;
            }

            res.redirect('field.html');
        });
    });
});

app.post("/provider_final", (req,res)=>{
    app.use(express.static('notlog'));
    res.sendFile(__dirname + "/notlog/index.html");
});

//Post in client signup form
app.post('/client_submit', (req, res) => {
    if (!req.body) {
        res.status(400).send("Bad request. No request data found.");
        return;
    }

    const fname = req.body.fname_client;
    const lname = req.body.lname_client;
    const age = req.body.age_client;
    const gender = req.body.gender_client;
    const username = req.body.username_client;
    const password = req.body.password_client;
    const address = req.body.address_client;
    const email = req.body.email_client;
    const profile = "client";
    const profileimg = "profile_icon.png";


    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send("Database connection error: " + err.message);
            return;
        }

        const sql = "INSERT INTO provider (fname, lname, age, gender, username, password, address, email, profile, profileimg) VALUES (?,?,?,?,?,?,?,?,?,?);";

        connection.query(sql, [fname, lname, age, gender, username, password, address, email, profile,profileimg], (err, result) => {
            connection.release();

            if (err) {
                res.status(500).send("Error inserting data: " + err.message);
                return;
            }

            app.use(express.static('notlog'));
            res.sendFile(__dirname + "/notlog/index.html");
        });
    });
});

//logging in
app.post('/login', (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;

    pool.getConnection((err,connection) => {
        if(err) throw err;

        const sql = "SELECT * FROM provider WHERE username = ? AND password = ?;";
        connection.query(sql,[username, password],(err,result)=>{
            if(err) throw err;
            if(result.length > 0){
                //SESSION DATA 
                    req.session.fname = {firstname: result[0].fname};
                    req.session.lname = {lastname: result[0].lname};
                    req.session.age = {age: result[0].age};
                    req.session.gender = {gender: result[0].gender};
                    req.session.username = {username: result[0].username};
                    req.session.address = {address: result[0].address};
                    req.session.email = {email: result[0].email};
                    req.session.profileimg = {profileimg: result[0].profileimg}
                    

                if(result[0].profile === "provider"){
                    //Provider Execution
                    const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
                    const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
                    const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

                    connection.query(sql_provider1, [req.session.username.username],(err,results) => {

                        if (err) {
                            res.status(500).send("Error querying data: " + err.message);
                            return;
                        }
                        connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                            if(err) throw err;
                        });

                        connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                            if(err) throw err;
                            app.use(express.static('log'));
                            res.render("main_provider.ejs", {data:results, sec:result_3});
                            connection.release();
                        });
                    });
                    
                } else if(result[0].profile === "client"){
                    //client execution
                    const sql_client = "SELECT * FROM offer";
                    const sql_client2 = "UPDATE clientsession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
                    const sql_client3 = "SELECT *FROM clientsession WHERE username = ?;";


                    connection.query(sql_client, (err, results) => {

                        if (err) {
                            res.status(500).send("Error querying data: " + err.message);
                            return;
                        }
                        connection.query(sql_client2, [req.session.username.username,req.session.address.address,req.session.profileimg.profileimg], (err, result2)=>{
                            if(err) throw err;
                        });

                        connection.query(sql_client3, [req.session.username.username], (err, result_3) =>{
                            if(err) throw err;
                            app.use(express.static('log'));
                            res.render("main", {data:results, sec:result_3});
                            connection.release();
                        });
                    });
                }
            
            } else {
                res.send("Are you blind?");
            }
        });
    });
});

//Profile Update for provider side
app.post('/update', uploadProfile.single('profiles'),(req,res) =>{
    const photo = req.file.filename;

    pool.getConnection((err,connection) => {
        if(err) throw err;
        const sql = "UPDATE provider SET profileimg = ? WHERE username = ?;";
        const sql2 = "UPDATE offer SET profileimg = ? WHERE username = ?;";
        connection.query(sql,[photo,req.session.username.username],(err, result)=>{
            if(err) throw err;
            connection.query(sql2,[photo,req.session.username.username],(err,result1)=>{
                connection.release();
                if(err) throw err;
                res.send(`${photo} uploaded successfully`);
            });

        });
    });
});

//Profile Details Update for Provider Side
app.post('/prof_upd',(req,res)=>{
    const newUsername = req.body.new_username;
    const newAddress = req.body.new_address;

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        const update = "UPDATE provider SET username = ? WHERE profileimg = ?;";
        const update2 = "UPDATE provider SET address = ? WHERE profileimg = ?;";

        connection.query(update,[newUsername, req.session.profileimg.profileimg],(err,result)=>{
            if(err) throw err;
            connection.query(update2,[newAddress,req.session.profileimg.profileimg],(err,result2)=>{
                connection.release();
                if(err) throw err;
                
                res.send("Profile Details Updated Successfully");
            });
        });
    });
});

//Job provide form in modal
app.post('/postJob', (req,res) => {
    const category = req.body.category;
    const description = req.body.description;
    const fullname = `${req.session.fname.firstname} ${req.session.lname.lastname}`;
    const address = req.session.address.address;
    const username = req.session.username.username;
    const link = req.body.link;
    const profileimg = req.session.profileimg.profileimg;

    pool.getConnection((err,connection) => {
        if(err) throw err;
        const sql = "INSERT INTO offer (fullname, address, category, description, offerDate, username, account, profileimg) VALUES (?,?,?,?,CURDATE(),?,?,?);";
        connection.query(sql,[fullname, address, category, description, username,link,profileimg],(err,result)=>{
            connection.release();
            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
        });
    });
    
});

//logout in main_provider page
app.post("/logout", (req,res) =>{
    req.session.destroy((err)=>{
        if(err){
            throw err;
        } else {
            // Set Cache-Control header to prevent caching
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            //res.sendFile(__dirname + "/notlog/index.html");
            res.redirect('/');
        }
    });
});

//provider home directory
app.get('/main_provider', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("main_provider.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//about directory
app.get('/about', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("about.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//services directory
app.get('/services', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("services.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//contact directory
app.get('/contact', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("contact.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//job seeker directories
//provider home directory
app.get('/main', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //client execution
        const sql_client = "SELECT * FROM offer";
        const sql_client2 = "UPDATE clientsession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_client3 = "SELECT *FROM clientsession WHERE username = ?;";


        connection.query(sql_client, (err, results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_client2, [req.session.username.username,req.session.address.address,req.session.profileimg.profileimg], (err, result2)=>{
                if(err) throw err;
            });

            connection.query(sql_client3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("main", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//about directory
app.get('/about_seeker', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("about_seeker.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//services seeker directory
app.get('/services_seeker', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("services_seeker.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});

//contact seekers directory
app.get('/contact_seeker', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        //Provider Execution
        const sql_provider1 = "SELECT *FROM offer WHERE username = ?;";
        const sql_provider2 = "UPDATE usersession SET username = ?, address = ?, profileimg = ? WHERE id = 1;";
        const sql_provider3 = "SELECT *FROM usersession WHERE username = ?;";

        connection.query(sql_provider1, [req.session.username.username],(err,results) => {

            if (err) {
                res.status(500).send("Error querying data: " + err.message);
                return;
            }
            connection.query(sql_provider2, [req.session.username.username, req.session.address.address, req.session.profileimg.profileimg], (err, result_2) =>{
                if(err) throw err;
            });

            connection.query(sql_provider3, [req.session.username.username], (err, result_3) =>{
                if(err) throw err;
                app.use(express.static('log'));
                res.render("contact_seeker.ejs", {data:results, sec:result_3});
                connection.release();
            });
        });
    });
});


app.listen(3000, ()=>console.log("Port Running in 3000"));