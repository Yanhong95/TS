import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import Component from './base-component.js';
import { autobind } from '../decorators/autobind.js';

// ProjectItem Class
// projectItem class 继承 Component 并要实现 Draggable 接口.
export class ProjectItem extends Component<HTMLUListElement, HTMLLinkElement> implements Draggable {
  private project: Project;

  // get方法, 下面用this.getPersons调用, 当做property调用.
  get getPersons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    // 调用super 然后传递基本值给Component class 来实现这个抽象类
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  // let's use our event object here,  because that has a data transfer property. This is special for drag events. They do have such a data transfer property and on that property you can attach data to the drag event and you'll later be able to extract that data upon a drop. 
  // The browser and JavaScript behind the scenes will store that data during the drag operation and ensure that the data you get when the drop  happens is the same data you attach here
  @autobind
  dragStartHandler(event: DragEvent) {
    // 这个dragstart event有dataTransfer属性, 可以携带数据, 当我们drop的时候我们可以在那个component用同样的方法获取到这个数据.
    // 输入移动数据的type: text/plain, 和数据: this.project.id
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  // dragEndHandler(event: DragEvent){
  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  // 添加方法
  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  };

  // render project, 将数据加入到对应的filed里
  renderContent() {
    this.element.querySelector('h2')!.innerHTML = this.project.title;
    this.element.querySelector('h3')!.innerHTML = this.getPersons + ' assigned';
    this.element.querySelector('p')!.innerHTML = this.project.description;
  };
}
