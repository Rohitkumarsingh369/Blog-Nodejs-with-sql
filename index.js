const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rohit0206",
  database: "blog",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connected succeeded");
  else
    console.log("DB connect failed\nError" + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () =>
  console.log("Express server is running at port number :3000")
);

//get all blog form the database
app.get("/blog", (req, res) => {
  mysqlConnection.query("SELECT * FROM blogs ", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//get an blog form the database
app.get("/blog/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM blogs  WHERE blogid=?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an blog
app.delete("/blog/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM blogs WHERE blogid = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully.");
      else console.log(err);
    }
  );
});

//insert an employee
app.post("/blogs", (req, res) => {
  const emp = req.body;
  var sql = "INSERT INTO blogs  SET ?";
  mysqlConnection.query(sql, emp, (err, rows, fields) => {
    if (!err) res.send(" Successfully  Inserted");
    else console.log(err);
  });
});

//update an employee
app.put("/blogs", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @blogid = ?;SET @title = ?;SET @date = ?;SET @author = ?;SET @content = ?; \
    CALL updatetable(@blogid,@title,@date,@author,@content);";
  mysqlConnection.query(
    sql,
    [emp.blogid, emp.title, emp.date, emp.author, emp.content],
    (err, rows, fields) => {
      if (!err) res.send("Updated successfully");
      else console.log(err);
    }
  );
});