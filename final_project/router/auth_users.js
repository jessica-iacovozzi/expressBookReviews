const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

//check is the username is valid
const isValid = (username)=>{
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  const app = express();
  app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));
  app.use(express.json());

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
    let token = jwt.sign({ data: password 
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      token,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
  book.reviews = review;
  res.send(`Review "${review}" added to book ${isbn}.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    let review = book.reviews;
    res.send(`Review "${review}" deleted from book ${isbn}.`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
