//any changes made to a server require a restart
const express = require('express')
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question
const cookie = require('cookie-parser')
const signature = require('cookie-signature')
const morgan = require('morgan');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie())
app.use(morgan('dev'))
app.set("view engine", "ejs");


//all app.gets are called "route definitions"

//short url is an id for long urls, random string of characters
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca", 
    "9sm5xK": "http://www.google.com",
    "4dcS23": "http://www.instagram.com"
  };

    app.get("/urls.json",(req,res) => {
    res.send('Hello')
    app.get("/hello", (req, res) => {
        res.send("<html><body>Hello <b>World</b></body></html>\n");
      });
})

  // app.get("/set", (req, res) => {
  //   const a = 1;
  //   res.send(`a = ${a}`);
  //  });
   
  //  app.get("/fetch", (req, res) => {
  //   res.send(`a = ${a}`);
  //  });

   app.get("/urls",(req,res) => {
    const templateVars = { urls: urlDatabase, name: req.cookies.username }; // the object
    console.log(req.cookies)
    console.log(req.cookies.username)
    res.render("urls_index", templateVars);
   })


   app.get("/urls/new", (req, res) => {
    const templateVars = { urls: urlDatabase, name: req.cookies.username };
    res.render("urls_new", templateVars);
  });

   app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL], name: req.cookies.username};
    res.render("urls_show", templateVars);
    
  });

   app.post("/urls/:shortURL", (req, res) => {
     const shortURL = req.params.shortURL;
     const longURL = req.body.longURL;
     urlDatabase[shortURL] = longURL;
     res.redirect('/urls'); // when you submit the form, redirect ridrects the specified information to the browser
     
   })

  
   app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body (object) to the console, //when you submit a form, you're creating a new POST request provided that the forms method is post
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });
  
  app.get("/urls", (req,res) => {
    const longURL = req.body.longURL;
    res.redirect("/u/:shortURL")
    
  })

  app.post("/urls/:id", (req, res) => { //need to fix
    const shortURL = req.params.id;
    const longURL = req.body.id; //dot notation reads exact strings of "shortURL"
    urlDatabase[shortURL] = longURL;
    res.redirect('/urls')
  });

  app.post("/urls/:shortURL/delete", (req,res) => {
    const idToBeDeleted = req.params.shortURL;
    delete urlDatabase[idToBeDeleted];
    res.redirect('/urls');
  })

  app.get("/login",(req,res) => {
    res.send("hi")
  })

  app.post("/login", (req,res) => {
      console.log(req.body) //req body is just a object where we retrieve information
      res.cookie("username",req.body.username); // name,value //cookies are just name tags
      res.redirect("/urls")
      
  })

  

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})

   //can you make a local host up? 
   // what is that in the terminal