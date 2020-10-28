/*
function add(n1: number, n2:number) {
  return n1 + n2;
}

const number1 = "5";
const number2 = 2.8

const result = add(+number1, +number2);
console.log(result);
*/
/*
function add(n1: number, n2: number, showResult: boolean, phrase: string) {
  // if (typeof n1 !== 'number' || typeof n2 !== 'number') {
  //   throw new Error('Incorrect input!');
  // }
  const result = n1 + n2;
  if (showResult) {
    console.log(phrase + result); // output:  `Result is: ${result}`
  } else {
    return result;
  }
}

const number1 = 5; // 5.0
const number2 = 2.8;
const printResult = true;
const resultPhrase = 'Result is: ';

add(number1, number2, printResult, resultPhrase);
*/
/*
const person: { name: string; age: number; } = {
    name: 'Maximilian',
    age: 30
  };

console.log(person.name);
*/
/*
const person: {
  name: string;
  age: number;
  hobbies: string[];
  role: [number, string];
} = {
  name: 'Maximilian',
  age: 30,
  hobbies: ['Sports', 'Cooking'],
  role: [2, 'author']
};
// unable to detect push function but below code is absolutely wrong, bucause role only contains two item.
person.role.push('admin');
// TS detect that role[1] should be string rather than number
// person.role[1] = 10;
// TS detect that the lenght role[] should be 2 rather than 3
// person.role = [0, 'admin', 'user'];
*/
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role[Role["READ_ONLY"] = 100] = "READ_ONLY";
    Role["AUTHOR"] = "AUTHOR";
})(Role || (Role = {}));
;
var person = {
    name: 'Maximilian',
    age: 30,
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN
};
if (person.role === Role.AUTHOR) {
    console.log('is author');
}
