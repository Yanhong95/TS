// // 这个借口定义一个Person对象有name 和 age 两个property, 并且有一个greet方法不返回任何值.
// interface Person{
//   name: string;
//   age: number;

//   greet(phrase: string): void;
// }

// let user1: Person;

// user1 = {
//   name: 'cyh',
//   age: 25,
//   greet(phrase: string){
//     console.log(phrase + " " + this.name);
//   }
// }

// user1.greet('Hi there - I am ')

// interface Greetable {
//   name: string;

//   greet(phrase: string): void;
// }

// class Person implements Greetable {
//   name: string;
//   age = 25;

//   constructor(n: string) {
//     this.name = n;
//   }

//   greet(phrase: string) {
//     console.log(phrase + ' ' + this.name);
//   }
// }


// let user1: Greetable;

// user1 = new Person('cyh');
// // user1.name = 'Manu';

// user1.greet('Hi there - I am');
// console.log(user1);