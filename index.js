// Require the express web application framework (https://expressjs.com)
const express = require('express');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');     // Added to support access to file system paths
const { title } = require('process');
const session = require('express-session');
const bcrypt = require('bcrypt');

let db = new sqlite3.Database('myFormsDB');
let accountList = [];
const app = express();
const port = 3000;

const loadUsersFromDB = () => {
    let db = new sqlite3.Database('myFormsDB');
    db.all('SELECT username, email, password FROM Users', [], (err, rows) => {
        if (err) {
            console.error('Error loading users from database:', err.message);
            return;
        }
        accountList = rows.map(row => ({
            username: row.username,
            email: row.email,
            password: row.password
        }));
        console.log('Loaded users from database into accountList:', accountList);
    });
    db.close();
};

loadUsersFromDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Have the logging code 
app.use(morgan('common'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));

// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.get('/login', (req, res) => {
    res.render('login', { message: null });
});

// Route for home page after login
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { loggedIn: true, username: req.session.user.username });
    } else {
        res.render('home', { loggedIn: false, username: null });
    }
});

app.get('/help', (req, res) => {
    res.render('help');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/figure', (req, res) => {
    res.render('figure');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.get('/product', (req, res) => {
    res.render('tcg');
});

app.get('/social', (req, res) => {
    res.render('social');
});

app.get('/create', (req, res) => {
    res.render('create');
});


// The default route handler '/' uses the index.ejs temaplte
app.get('/', (req, res, next) => {
    res.render('index', { title: 'dKin Membership Form' });
});

app.post('/submitfeedback', (req, res, next) => {
    console.log('We got a POST feedback');
    console.log(req.body);
    let fname = req.body.firstname;
    let sname = req.body.surname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let ad = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let cmt = req.body.comments;


    db.run(`INSERT INTO Forms (fname, sname, email, mobile, address, city, state, zip, comment) 
    VALUES(?,?,?,?,?,?,?,?,?)`,
        [fname, sname, email, mobile, ad, city, state, zip, cmt],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('New feedback form added to the database');
        });
    db.close();
    res.render('thankyou', { title: 'Feedback Details', fname: fname, sname: sname, email: email, mobile: mobile, ad: ad, city: city, state: state, zip: zip, cmt: cmt });
});

app.post('/create', async (req, res, next) => {
    let username = req.body.user;
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedUsername = await bcrypt.hash(username, salt);
    const hashedEmail = await bcrypt.hash(email, salt);
    
    let flag =true;
    for (const user of accountList) {
        const usernameMatch = await bcrypt.compare(username, user.username);
        const emailMatch = await bcrypt.compare(email, user.email);
        if (usernameMatch) {
            console.log("Username has been used");
            res.render('create.ejs', { message: "Username has been used" });
            flag = false;
            break; // Stop further execution
        } else if (emailMatch) {
            console.log("Email has been used!!!");
            res.render('create.ejs', { message: "Email has been used" });
            flag = false;
            break; // Stop further execution
        }
    }

    if (flag) {
        db.run(
            `INSERT INTO Users (username, email, password) VALUES(?, ?, ?)`,
            [hashedUsername, hashedEmail, hashedPassword],
            function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Database error');
                    return;
                }
                console.log('New account added to the database');

                // Add new user to in-memory account list
                let newUser = { username: hashedUsername, email: hashedEmail, password: hashedPassword };
                accountList.push(newUser);

                res.render('create.ejs', { message: "Create Account Successfully!!" });
            }
        );
    }
});

// Route for login form submission
app.post('/login', async (req, res) => {
    console.log("req.body:", req.body);
    try {
        const { email, password } = req.body;
        let foundUser = null;

        // Compare each user's hashed email with the provided plain text email
        for (const user of accountList) {
            const emailMatch = await bcrypt.compare(email, user.email);
            if (emailMatch) {
                foundUser = user;
                break; // Stop if we find the matching user
            }
        }

        if (foundUser) {
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (isMatch) {
                req.session.user = foundUser;  // Use foundUser to save user in session
                res.redirect('/home');
            } else {
                res.render('login', { message: 'Invalid email or password' });
            }
        } else {
            res.render('login', { message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error login account:", error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for logout
app.get('/logout', (req, res) => {
    req.session.destroy();  // Destroy session
    res.redirect('/');
});

// app.get('/feedback', (req, res) => {
//     let db = new sqlite3.Database('myFormsDB');
//     db.all('SELECT * FROM Forms', (err, rows) => {
//         if (err) {
//             return console.error(err.message);
//         }

//         // If no records are found, send a message
//         if (rows.length === 0) {
//             res.render('memberfeedback', { title: 'No Memberships Found', members: [] });
//         } else {
//             // Render the `member.ejs` template with the retrieved membership data
//             res.render('memberfeedback', { title: 'Membership List', members: rows });
//         }
//     });
//     db.close();  // Ensure db connection is closed
// });

app.get('/feedback', (req, res) => {
    let db = new sqlite3.Database('myFormsDB');
    db.all('SELECT * FROM Users', (err, rows) => {
        if (err) {
            return console.error(err.message);
        }

        // If no records are found, send a message
        if (rows.length === 0) {
            res.render('memberfeedback', { title: 'No Memberships Found', members: [] });
        } else {
            // Render the `member.ejs` template with the retrieved membership data
            res.render('memberfeedback', { title: 'Membership List', members: rows });
        }
    });
    db.close();  // Ensure db connection is closed
});


// The '404 file not found' error handler uses the temaplte 404.ejs
app.use((req, res) => {
    res.status(404);
    res.render('404', { title: '404', message: '404 - Not Found', url: req.url });
})

// The final error handler uses the temaplte error.ejs
app.use((error, request, response, next) => {
    let errorStatus = error.status || 500;
    response.status(errorStatus);
    response.render('error', { title: '5xx', message: '5xx - System error', error: error });
});

// Tell our application to listen to requests at port 3000 on the localhost
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Web server running at: http://localhost:${port}`);
        console.log(`Type Ctrl+C to shut down the web server`);
    });
}

// Export the app for testing
module.exports = app; // Export both app and users