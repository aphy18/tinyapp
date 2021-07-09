//any changes made to a server require a restart
const express = require('express')
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question
const cookieSession = require('cookie-session')
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['abcdefghijklmnopqr123456789'],
}));
app.use(morgan('dev'))
app.set("view engine", "ejs");

const { isEmailBeingUsed } = require('./helpers.js');

// const {email, password} = req.body

//all app.gets are called "route definitions"

//short url is an id for long urls, random string of characters
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = { 
    "aJ48lW": {
      id: "aJ48lW", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
    
  }

 //users[user_id].email // to access




function generateRandomString(length) {
  let r = Math.random().toString(36).substring(length);
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', r)
  return r;
}

   app.get("/urls",(req,res) => {
     const user = users[req.session.user_id]
    const templateVars = { urls: urlDatabase, user };
     if(!user){
       res.status(400).send("Error,you have to log in to have access")
     }
  
    console.log(req.session.email)
    console.log(req.session.user_id)
    res.render("urls_index", templateVars);
    
})
// -------D E L E T E----------

 app.post("/urls/:id/delete", (req,res) => {
  const user = users[req.session.user_id];
  console.log(user)
  const shortURL = req.params.id;
  console.log(urlDatabase);
  const userID = urlDatabase[shortURL].userID;
  console.log(userID);

   //figure out other way
    if (userID !== user) {
      console.log("You can't delete this");
    }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


   app.get("/urls/new", (req, res) => {
    const user = users[req.session.user_id]
    const templateVars = { urls: urlDatabase, user };
    if(!user){
      res.status(400).send("Error,you have to log in to have access. Please <a href ='login'>try again</a>")

    }
    res.render("urls_new", templateVars);
    
});

  //templateVar is only for rendering (mostly for gets)

  app.post("/urls/new", (req,res) => {
    const shortURL = generateRandomString(7);
    const longURL = req.body.longURL;
    if(!longURL) {
      res.status(400).send("Error, please enter a valid longURL.");
    } else {
      urlDatabase[shortURL] = {
        longURL,
        userID:res.cookie("userID")

      }
    }
    
    
    res.redirect("/urls");
    
  });

   app.get("/urls/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    console.log(shortURL)
    const longURL = urlDatabase[shortURL].longURL
    console.log(longURL)
    if(longURL){
      const templateVars = { shortURL: shortURL, longURL: longURL, user: users[req.session.user_id] };
      res.render("urls_show", templateVars);
    }

    res.status(400).send("Big Error")

    
});

   app.post("/urls/:shortURL", (req, res) => {
     const shortURL = req.params.shortURL;
     const longURL = req.body.longURL;
     
      urlDatabase[shortURL].longURL = longURL
  
     res.redirect("/urls"); // when you submit the form, redirect ridrects the specified information to the browser
     
});

  app.get("/u/:shortURL", (req,res) => {
      const shortURL = req.params.shortURL;
      const longURL = urlDatabase[shortURL].longURL;
      res.redirect(longURL);
  })



  app.get("/login",(req,res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session.user_id]};
    res.render("urls_login", templateVars)
});

  app.post("/login", (req,res) => {
    const email = req.body.email; //just grabbed it, didnt define it
    const password = req.body.password
    const hashedPassword= bcrypt.hashSync(password, 10)
    if(!isEmailBeingUsed(email, users)){
      return res.status(400).send("Email doesn't exist. Please <a href='login'> try again.")
    }
  
    
    for(let user in users){
      if(bcrypt.compareSync(password, hashedPassword)){
        if(email === users[user].email){
          if(password === users[user].password){
            res.cookie("user_id",users[user].id); //the point of the cookie is to save ur data to database
            res.cookie("email", email)
          return res.redirect("/urls")
        }
      }
    }
  }
    
    return res.status(403).send("Go away.")
  })
  app.post("/logout", (req,res) => {
    req.session = null;
    res.redirect("/login")
  })
 

  app.get("/register", (req,res) => {
    const templateVars = { user: req.session.user_id }; //you dont need to see shourturl and longurl here
    res.render("urls_register",templateVars)
});
  
  app.post("/register", (req,res) => {
  const email = req.body.email;     //just grabbed it, didnt define it
  const password = req.body.password;
  
  if(!email || !password) {
    return res.status(400).send("Email and Password are required to register")
  } 
  
   
  if(isEmailBeingUsed(email,users)){
    
    return res.status(400).send("Email is already taken")
  }
  
  const newUser = {} //make new object
  newUser.email = email; //push email value
  newUser.password = password; //push pw value
  newUser.id = generateRandomString(7); //push id value
  users[newUser.id] = newUser;

 
   //in the users object push the newUser obj with the key being its id


  req.session.user_id = newUser.id;
  req.session.email = email;
  res.redirect("/urls")
});


  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})




// Log the POST request body (object) to the console,
 //when you submit a form, you're creating a new POST request provided that the forms method is post
    // Respond with 'Ok' (we will replace this)

 //have to merge twice


   // app.get("/set", (req, res) => {
  //   const a = 1;
  //   res.send(`a = ${a}`);
  //  });
   
  //  app.get("/fetch", (req, res) => {
  //   res.send(`a = ${a}`);
  //  });