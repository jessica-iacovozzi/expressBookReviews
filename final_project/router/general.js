const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        res.send(JSON.stringify({books},null,4));
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = await req.params.isbn;
        res.send(books[isbn]);
    } catch (error) {
        res.status(500).send(error);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const reqAuthor = await req.params.author;    
        const allBooks = Object.values(books);
        let filteredBooks = {}
        for (const { author, title, reviews } of allBooks) {
            if(author === reqAuthor) {
                filteredBooks = {
                    "author": author,
                    "title": title,
                    "reviews": reviews
                };
            }
        }
        res.send(filteredBooks);
    } catch (error) {
        res.status(500).send(error);
    }
    
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const reqTitle = await req.params.title;    
        const allBooks = Object.values(books);
        let filteredBooks = {}
        for (const { author, title, reviews } of allBooks) {
            if(title === reqTitle) {
                filteredBooks = {
                    "author": author,
                    "title": title,
                    "reviews": reviews
                };
            }
        }
        res.send(filteredBooks);
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
