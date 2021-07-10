//any changes made to a server require a restart
const express = require('express');
const app = express();
const PORT = 8080; //you can use any port outside of vagrant, ports lead to different question
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: 'session',
  keys: ['abcdefghijklmnopqr123456789'],
}));
app.use(morgan('dev'));
app.set("view engine", "ejs");

const { isEmailBeingUsed, returnUser, urlsForUser} = require('./helpers.js');


// const {email, password} = req.body

//all app.gets are called "route definitions"

//short url is an id for long urls, random string of characters
const urlDatabase = {};

const users = {};

//users[userID].email // to access

const generateRandomString = length => {
  let r = Math.random().toString(36).substring(length);
  return r;
};

app.get("/urls", (req, res) => {
  const user = users[req.session.userID];
  const urls = urlsForUser(req.session.userID,urlDatabase);
  console.log(user);
  
  const templateVars = {
    user: user,
    urls: urls
  
  };

  res.render("urls_index", templateVars); //the point of the cookie is to save ur data to database
  
});
// -------D E L E T E----------

app.post("/urls/:id/delete", (req, res) => {
  const user = users[req.session.userID];
  const email = user.email;
  console.log(user,email);
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
  const user = users[req.session.userID];
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  if (!user) {
    console.log('>>>>>>>>>',user);
    res.status(400).send("Error,you have to log in to have access. Please <a href ='login'>try again</a>");
    
  }
  res.render("urls_new", templateVars);

});

//templateVar is only for rendering (mostly for gets)

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString(7);
  const longURL = req.body.longURL;
  if (!longURL) {
    res.status(400).send("Error, please enter a valid longURL.");
  } else {
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: req.session.userID

    };
  }

  
  res.redirect("/urls");

});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  console.log(urlDatabase);
  if (longURL) {
    const templateVars = {
      shortURL: shortURL,
      longURL: longURL,
      user: user
    };
    res.render("urls_show", templateVars);
  }

  res.status(400).send("Big Error");


});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  console.log(shortURL, longURL);
  urlDatabase[shortURL].longURL = longURL;
  console.log(urlDatabase);
  res.redirect("/urls"); // when you submit the form, redirect ridrects the specified information to the browser

});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});



app.get("/login", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.userID]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  
  const email = req.body.email; //just grabbed it, didnt define it
  const password = req.body.password;
  
  if (!email || !password) {
    res.status(400).send("no email or password");
  } else if (!isEmailBeingUsed(email, users)) {
    return res.status(400).send("Email doesn't exist. Please <a href='login'> try again.");
  }

  const user = returnUser(email, users);

  if (bcrypt.compareSync(password, user.password)) {
    req.session.userID = user.userID; //the point of the cookie is to save ur data to database
    return res.redirect("/urls");
  } else {
    res.status(400).send("incorrect password");
  }
});
  


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  }; //you dont need to see shourturl and longurl here
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email; //just grabbed it, didnt define it
  const password = req.body.password;
  const hashPassword = bcrypt.hashSync(password, 10);
  
  console.log(email,password);
  if (!email || !password) {
    return res.status(400).send("Email and Password are required to register");
  } else if ((isEmailBeingUsed(email, users))) {
    return res.status(400).send("Email is already taken");
  } else {
    const userID = generateRandomString(7);
    const password = hashPassword;
    users[userID] = {userID, email, password};
    req.session.userID = userID;
    res.redirect("/urls");
  }

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




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


// ps aux | grep node
//kill -9 5034