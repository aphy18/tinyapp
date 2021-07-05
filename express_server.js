//any changes made to a server require a restart

const express = require('express')
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question

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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})

app.get("/set", (req, res) => {
    const a = 1;
    res.send(`a = ${a}`);
   });
   
   app.get("/fetch", (req, res) => {
    res.send(`a = ${a}`);
   });

   //can you make a local host up? 
   // what is that in the terminal