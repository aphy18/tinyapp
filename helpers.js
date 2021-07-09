function isEmailBeingUsed(email, users){ //for key object
    for(user in users) {
     if(email === users[user].email){
        return true;
      }
      
    }
    return false;
}


module.exports = {
    isEmailBeingUsed
} 