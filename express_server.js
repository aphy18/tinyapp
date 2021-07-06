//any changes made to a server require a restart

const express = require('express')
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question

app.set("view engine", "ejs");

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

   app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
    res.render("urls_show", templateVars);
  });

   app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})

   //can you make a local host up? 
   // what is that in the terminal