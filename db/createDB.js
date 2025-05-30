let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('myFormsDB'); // file database

db.serialize(function(){

    db.run("CREATE TABLE IF NOT EXISTS Forms (id integer primary key autoincrement, fname TEXT, sname TEXT, email TEXT, mobile TEXT,address TEXT,city TEXT,state TEXT ,zip TEXT, comment TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS Users (id integer primary key autoincrement, username TEXT, email TEXT, password password)");

    db.run("DELETE FROM Forms");
    db.run("DELETE FROM Users");


    console.log('Display all content from all rows of the DB');
    db.each("SELECT * FROM Forms", function(err,row){
        console.log(`[Forms] (${row.id}) Name: ${row.fname} ${row.sname}, Email: ${row.email},
        Mobile: ${row.mobile}, Address: ${row.ad}, city: ${row.city},state: ${row.state},   zip: ${row.zip}, comment: ${row.cmt}`);
    });
    db.each("SELECT * FROM Users", function(err,row){
        console.log(`[Users] (${row.id}) User Name: ${row.name}, Email: ${row.email}, Password: ${row.password}`);
    });
});
db.close();