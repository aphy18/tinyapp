function isEmailBeingUsed (email, users) {
  for (user in users) {
    if (email === users[user].email) {
    return true;
};

}
  return false;
};

function returnUser(email, db) {
  for( let user in db) {
    if( db[user].email === email) {
      return db[user];
    }
  }
  return false;
}

const urlsForUser = (id,db) => {
  const userURLs = {};
  for (let url in db) {
    if(db[url].userID === id) {
      userURLs[url] = db[url];
    }
  }
  return userURLs;
};


module.exports = {
  isEmailBeingUsed,
  returnUser,
  urlsForUser
};