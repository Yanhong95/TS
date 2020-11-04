// import {Validatable, validate} from './validation.js';

// Drag & Drop Interface
interface Dragable{
  dragStartHandler(event: DragEvent) : void;
  dragEndHandler(event: DragEvent) : void;
}
interface DragTarget{
  // permit the drop
  dragOverHandler(event: DragEvent) : void;
  // handle the drop update UI
  dropHandler(event: DragEvent) : void;
  // give some feel back base on cuccess or faild of drag action.
  dragLeaveHandler(event: DragEvent) : void;
}

// Project Type
enum ProjectStatus {
  Active,
  Finished
}

// Project class
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) { }
}

// Listener Type 其实是一个function 接受一个Generics array type 作为参数, 然后返回null.
type Listener<T> = (items: T[]) => void;

// central state class, 用来规范state并被继承和实现.
class State<T>{
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }

}

// real state, 继承State类, 并调用super()来实现内部的listener list用来存放 function array.
class ProjectState extends State<Project> {
  
  private projects: Project[] = [];
  // 用来存放实例化的唯一实例.
  private static instance: ProjectState;

  private constructor() { 
    super();
  };

  // 单例模式, static 可以直接使用 ProjectState.getInstance()调用并实例化ProjectState;
  // 如果存在就直接返回这个class里的唯一实例this.instance. 否则新建一个返回.
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // 提供方法给添加project, 并且在这里调用updateProject();对project array 执行listener array里的所有方法.
  // 这里的具体方法就是根据当前 project 的 type, 比如 active或者finished, 来filter project里的project, 
  // 然后将对应type的project assign给当前的list. 然后render出来.
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
    this.projects.push(newProject);
    this.updateProject();
  }

  // 在一个project被drag&drop后触发, 传入这个被drop的project的Id, 和他被新assign的status. 如果和之前的不一样就更新.
  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find(proj => proj.id === projectId);
    // 当project status 不同的时候我们再re-render这个list.
    if(project && project.status !== newStatus){
      project.status = newStatus;
      this.updateProject();
    }
  }

  //对project array 执行listener array里的所有方法.
  private updateProject(){
    for (const listenerFn of this.listeners) {
      // 传递shallow copy
      listenerFn(this.projects.slice());
    }
  }

}

const projectState = ProjectState.getInstance();

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false, // 不能iteration
    get() {
      //下面这个this, 永远指向的是拥有这个get方法的class, 然后这个get方法是当前这个class的隐藏方法,所以这个this就是我们
      //decorate的function所属的class, 所以这个this就指向printerclass, 所以这里这个boundFn就bind了printer.
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  // overrite 旧的 descriptor
  return adjDescriptor;
}

// 定义abstract class 然后包含主要的render方法, 给下面两个方法继承
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateElement: string, hostElement: string, insertAtStart: boolean, newElementId?: string) {
    // 获取project-input template
    this.templateElement = document.getElementById(templateElement)! as HTMLTemplateElement;
    // 获取render这个project-input的地方
    this.hostElement = document.getElementById(hostElement)! as T;
    // 获取这个即将被render的element的内容 
    const importedNode = document.importNode(this.templateElement.content, true);
    // 并将这个内容赋值到this.element里, 由于template有一个父元素包裹,所以要用firstElementChild来获取子元素内容
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    //将template添加到hostElement的 afterbegin 或者 beforeend
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
  }
  
  // 两个抽象方法需要实现:
  abstract configure?(): void;
  abstract renderContent?(): void;
}

// projectItem class 继承 Component 并要实现 Dragable 接口.
class ProjectItem extends Component<HTMLUListElement, HTMLLinkElement> implements Dragable{
  private project: Project;

  // get方法, 下面用this.getPersons调用, 当做property调用.
  get getPersons(){
     if(this.project.people === 1){
       return '1 person';
     }else{
       return `${this.project.people} persons`;
     }
  }

  constructor(hostId: string, project: Project ){
    // 调用super 然后传递基本值给Component class 来实现这个抽象类
    super('single-project',hostId, false, project.id );
    this.project = project;
    this.configure();
    this.renderContent();
  }

  // let's use our event object here,  because that has a data transfer property. This is special for drag events. They do have such a data transfer property and on that property you can attach data to the drag event and you'll later be able to extract that data upon a drop. 
  // The browser and JavaScript behind the scenes will store that data during the drag operation and ensure that the data you get when the drop  happens is the same data you attach here
  @autobind
  dragStartHandler(event: DragEvent){
    // 这个dragstart event有dataTransfer属性, 可以携带数据, 当我们drop的时候我们可以在那个component用同样的方法获取到这个数据.
    // 输入移动数据的type: text/plain, 和数据: this.project.id
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  // dragEndHandler(event: DragEvent){
  dragEndHandler(_: DragEvent){
    console.log('DragEnd');
  }
  
  // 添加方法
  configure(){
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  };

  // render project, 将数据加入到对应的filed里
  renderContent(){
    this.element.querySelector('h2')!.innerHTML = this.project.title;
    this.element.querySelector('h3')!.innerHTML = this.getPersons + ' assigned';
    this.element.querySelector('p')!.innerHTML = this.project.description; 
  };
}


// projectList class 继承 Component 并要实现 Dragable 接口.
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  assignedProjects: Project[];

  // 实例化这个类的时候要指明type.
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.element.id = `${this.type}-projects`;
    // 这里来装对应type的project/
    this.assignedProjects = [];
    this.renderContent();
    this.configure();
  }

  // drag后移动到这个element上放会触发这个event 
  @autobind
  dragOverHandler(event: DragEvent){
    // 在这里检查drag over的时候是这个dragover event 是否携带dataTransfer, 这个transfer的数据是否为text/plain
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      // 这里添加event.preventDefault();是因为这个dragdrop event 规定, 
      // 当一个element可以被drop的时候且这个element同时监听了dragover event, 只有drapover event  preventDefault()了 才能drop
      // 可以理解为同一个element监听 dragover 和 drop 事件的时候是不允许drop事件的, 需要dragover 来 preventDefault();
      event.preventDefault();
      // 更新背景css
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable')
    }

  }

  // drop 到这个区域
  @autobind
  dropHandler(event: DragEvent){
    // 这个event应该存储了之前drag的element 在dragstart event里存储的数据, 也就是这个被drag的project的Id.
    console.log(event.dataTransfer!.getData('text/plain'));
    const prjId = event.dataTransfer!.getData('text/plain');
    // 触发projectState里的方法来更新project list里这个对应projrctId的projrct的status.
    projectState.moveProject(prjId, this.type === 'active'? ProjectStatus.Active : ProjectStatus.Finished )
  }

  // drap element到这个上方后, 又移走了 触发这个方法
  @autobind
  dragLeaveHandler(_: DragEvent){
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable')
  }

  // render对应的标题和ul
  renderContent() {
    // 根据不同的type 分别找到不同的unorderList 并添加这个project.
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'PROJECTS';
  }

  configure() {
    // target area 也就是<ul>
    // 当被drag的东西hover这块区域的时候, 改变背景色
    this.element.addEventListener('dragover', this.dragOverHandler);
    // 当被drag的东西离开这块区域的时候, 改回背景色
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    // 当drag的东西drop在这个区域, 我们更新数据state
    this.element.addEventListener('drop', this.dropHandler);

    // 在这里给project添加方法, 根据这个list 实例化时候传入的type 来和当前projects里的project的status比较
    // 这里用的是filter, 比如说如果实例化的时候这个区域是activelist, 然后this.type就是active,
    // 然后我们检查prj.status 是否等于 ProjectStatus.Active; 如果是 返回true, 这个filter就会保留这个project. 
    // 这样project type为active的project就被留到了 active list 里.
    // 当然这里只是定义一个方法加到projectState的listenerList里, 具体到addProject和dropProject的时候触发.看上面
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        } else {
          return prj.status === ProjectStatus.Finished;
        }
      })
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    })
  }

  private renderProjects() {
    // 先清空当前的list.
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    // 然后实例化所有的当前type的project 并添加到当前的ul里.
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
      // const listItem = document.createElement('li');
      // listItem.textContent = prjItem.title;
      // listEl.appendChild(listItem)
    }
  }

}


// 获取form里的值, 并render到active list里
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input' );
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    this.configure();
  }

  configure() {
    // 下面的第二个参数是一个方法, 这个方法内的this会被绑定到event.currentTarget里, 不再refer这个class, 这是不对的 我么得手动bind 或者使用decoration.
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent(){}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }


  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');



