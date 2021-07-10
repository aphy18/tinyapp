const { assert } = require('chai');
const assertEqual = require('../../../w1/lotide/assertEqual.js');

const { isEmailBeingUsed } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', () => {
    const result = isEmailBeingUsed("user@example.com", testUsers);
    const expectedOutput = true;
    assertEqual(result,expectedOutput);
  });
  it('should return undefined with a non-valid email', () => {
    const result = isEmailBeingUsed("blah@example.com", testUsers);
    const expectedOutput = false;
    assertEqual(result, expectedOutput);
  });
});


// describe("#head", () => {
//     it("returns 1 for [1, 2, 3]", () => {
//       assert.strictEqual(head([1, 2, 3]), 1);
//       head([1,2,3])
//      });
//     it("returns '5' for ['5']", () => {
//       assert.strictEqual(head(['5']), '5');
//     });
//   });