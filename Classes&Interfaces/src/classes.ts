// class Department {
//   name: string

//   constructor(name: string) {
//     this.name = name;
//   }

//   describe(this: Department) {
//     console.log(`Department: ${this.name}`);
//   }
// }

// const accounting = new Department( 'Accounting');

// accounting.describe(); // "Department: Accounting"

// // 这里describe对应的value是accounting.describe这个方法, 然后accountingCopy.describe();会执行这个方法
// // 但是这个方法里的this 不再指向accounting 而是call这个方法的对象accountingCopy, 由于accountingCopy里没有name 和 id, 
// // 所以这里出来的结果就是undefined.
// const accountingCopy = {  describe: accounting.describe };
// // accountingCopy.describe(); //  "Department: undefined"

// const accountingCopy2 = {  name: "DUMMY", describe: accounting.describe };
// accountingCopy2.describe(); //  "Department: DUMMY"



// class Department {
//   name: string;
//   employees: string[] = [];

//   constructor(name: string) {
//     this.name = name;
//   }

//   describe(this: Department) {
//     console.log(`Department: ${this.name}`);
//   }


//   addEmployee(employee: string){
//     this.employees.push(employee);
//   }

//     printEmployeeInformation() {
//     console.log(this.employees.length);
//     console.log(this.employees);
//   }
// }

// const accounting = new Department( 'Accounting');

// accounting.addEmployee('Max');
// accounting.addEmployee('Manu');

// accounting.printEmployeeInformation(); 

// accounting.employees[2] = 'Anna';


class Department {
  // private readonly id: string;
  // private name: string;
  protected employees: string[] = [];

  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }

  describe(this: Department) {
    console.log(`Department (${this.id}): ${this.name}`);
  }

  addEmployee(employee: string) {
    // validation etc
    // this.id = 'd2';
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

// const accounting = new Department('d1', 'Accounting');

// accounting.addEmployee('Max');
// accounting.addEmployee('Manu');

// // accounting.employees[2] = 'Anna';

// accounting.describe();
// accounting.name = 'NEW NAME';
// accounting.printEmployeeInformation();

// // const accountingCopy = { name: 'DUMMY', describe: accounting.describe };

// // accountingCopy.describe();



class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    // super 在这里完成被继承的父类的property的实现. 
    // 然后自己再在下面完成特殊的比如说这个ITDepartment独有的property.
    super(id, 'IT');
    this.admins = admins;
  }

  describe() {
    console.log('IT Department - ID: ' + this.id);
  }
}

const it = new ITDepartment('d1', ['Max']);

it.addEmployee('Max');
it.addEmployee('Manu');
it.describe();
it.name = 'NEW NAME';
it.printEmployeeInformation();

console.log(it);


class AccountingDepartment extends Department {
  private lastReport: string;

  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  addEmployee(name: string) {
    if (name === "Max") return;
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error('No report found.');
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('Please pass in a valid value!');
    }
    this.addReport(value);
  }
}
const accounting = new AccountingDepartment('d2', []);
// set mostRecentReport
accounting.mostRecentReport = 'Year End Report';
accounting.addReport('Something went wrong...');
// get mostRecentReport
console.log(accounting.mostRecentReport); // Something went wrong...

// Static Methods & Properties
class Department2 {
  static fiscalYear = 2020;
  // private readonly id: string;
  // private name: string;
  protected employees: string[] = [];

  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
    // 下面这个是不可以的, 静态变量和静态方法只能在class内部静态的地方调用. 别的地方不能用.
    // console.log(this.fiscalYear);
  }

  static createEmployee(name: string) {
    return { name: name };
  }
}

// 不需要 instantiating 一个Department对象.
const employee1 = Department2.createEmployee('Max'); // {name: "Max"}
console.log(employee1, Department2.fiscalYear);


//Abstract
abstract class Department3 {
  // 抽象方法不能有方法体, 必须子方法重写, 所以这里是void.
  abstract describe(this: Department): void;
  constructor(protected readonly id: string, public name: string) {
  }
}

class AccountingDepartment2 extends Department3 {
  // ....
  // overwrite
  describe() {
    console.log('Accounting Department - ID: ' + this.id);
  }
}

class ITDepartment2 extends Department3 {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins;
  }
  // ...
  // overwrite
  describe() {
    console.log('IT Department - ID: ' + this.id);
  }
}

// Singletons & Private Constructors
class AccountingDepartment3 extends Department {
  private lastReport: string;
  //这里我们用instance 这个private 静态变量来存储这个类自己, 然后这个instance只能在这个类内被调用比如下方的getInstance();
  private static instance: AccountingDepartment3;

  // get mostRecentReport() { ... }
  // set mostRecentReport(value: string) { ... }

  // 使用private constructor, 这样就不能直接new一个新对象
  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  get mostRecentReport() {
    if (this.lastReport) {
return this.lastReport;
    }
    throw new Error('No report found.');
  }

  // 不能new一个对象, 那如何access这个对象呢, 我们提供一个static方法, 这样就能保证每次返回的都是同一个对象, 具体看下面写法
  static getInstance() {
    if (AccountingDepartment3.instance) {
      return this.instance;
    }
    this.instance = new AccountingDepartment3('d2', []);
    return this.instance;
  }
  // .... 
}

const accounting3 = AccountingDepartment3.getInstance();
const accounting4 = AccountingDepartment3.getInstance();

console.log(accounting3, accounting4); // 两个是一模一样的