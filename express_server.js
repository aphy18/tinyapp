const express = require('express');
const app = express();
const PORT = 8080;
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
const urlDatabase = {};
const users = {};

const generateRandomString = length => {
  let r = Math.random().toString(36).substring(length);
  return r;
};

app.get("/urls", (req, res) => {
  const user = users[req.session.userID];
  const urls = urlsForUser(req.session.userID,urlDatabase);
  const templateVars = {
    user: user,
    urls: urls
  };
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
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
    res.status(400).send("Error,you have to log in to have access");
    
  }
  res.render("urls_new", templateVars);
});

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
  res.status(400).send("Can't find this page.");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  console.log(shortURL, longURL);
  urlDatabase[shortURL].longURL = longURL;
  console.log(urlDatabase);
  res.redirect("/urls");
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
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    res.status(400).send("Please enter a valid email and password.");
  } else if (!isEmailBeingUsed(email, users)) {
    return res.status(400).send("The email you've entered isn't valid.");
  }

  const user = returnUser(email, users);

  if (bcrypt.compareSync(password, user.password)) {
    req.session.userID = user.userID;
    return res.redirect("/urls");
  } else {
    res.status(400).send("The password you've entered is incorrect.");
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
  
  if (!email || !password) {
    return res.status(400).send("The email and password fields are required to register.");
  } else if ((isEmailBeingUsed(email, users))) {
    return res.status(400).send("The email you've entered is already taken.");
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
