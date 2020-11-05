"use strict";
const add1 = (a, b = 1) => a + b;
const printOutput = output => console.log(output);
const button = document.querySelector('button');
if (button) {
    button.addEventListener('click', event => console.log(event));
}
printOutput(add1(5));
const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];
activeHobbies.push(...hobbies);
const person = {
    firstName: 'Max',
    age: 30
};
const copiedPerson = Object.assign({}, person);
const add = (...numbers) => {
    return numbers.reduce((curResult, curValue) => {
        return curResult + curValue;
    }, 0);
};
const addedNumbers = add(5, 10, 2, 3.7);
console.log(addedNumbers);
const [hobby1, hobby2, ...remainingHobbies] = hobbies;
console.log(hobbies, hobby1, hobby2);
const { firstName: userName, age } = person;
console.log(userName, age, person);
//# sourceMappingURL=app.js.map