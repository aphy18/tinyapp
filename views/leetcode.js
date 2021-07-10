// const nonRepeatingValue = (str) => {
//   let arr = [];
//   for (let i = 0; i < str.length; i++) {
//     let prevChar = str.charAt(i - 1);
//     let currentChar = str.charAt(i);
//     let nextChar = str.charAt(i + 1);
//     if (prevChar === currentChar && currentChar !== nextChar) {
//       arr.push(nextChar);
//     }



//   }
//   console.log(arr[0]);
// };

// nonRepeatingValue("abfddc");

// i thought it was when the similar characters ended i .e aaaaa then b
// function nonRepeatingValue(chars) {


const nonRepeatingValue = (str) => {
    const obj = {};
    for(let char in str){
        if (char in obj) {
          obj[char] += 1;
        } else {
            obj[char] = 1;
        }
    }

    for(let char in obj){
        if(obj[char] === 1){
        console.log(char)
          return char
        }
    }
}


nonRepeatingValue("dfgthjkli")