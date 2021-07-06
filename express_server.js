//any changes made to a server require a restart
const express = require('express')
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
 
}

//all app.gets are called "route definitions"

//short url is an id for long urls, random string of characters
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca", 
    "9sm5xK": "http://www.google.com"
  };

app.get("/urls.json",(req,res) => {
    res.send('Hello')
app.get("/hello", (req, res) => {
        res.send("<html><body>Hello <b>World</b></body></html>\n");
      });
})

app.get("/set", (req, res) => {
    const a = 1;
    res.send(`a = ${a}`);
   });
   
   app.get("/fetch", (req, res) => {
    res.send(`a = ${a}`);
   });

   app.get("/urls",(req,res) => {
    const templateVars = { urls: urlDatabase }; // the object
    res.render("urls_index", templateVars);
   })


   app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

   app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
    res.render("urls_show", templateVars);
  });

  app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });

  app.get("/u/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL
    const longURL = urlDatabase[shortURL]; //dot notation reads exact strings of "shortURL"
    res.redirect(longURL);
  });


  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})

   //can you make a local host up? 
   // what is that in the terminal