/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/drag-drop.ts" />

namespace App {
  // ProjectList Class
   
  // projectList class 继承 Component 并要实现 Dragable 接口.
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
    dragOverHandler(event: DragEvent) {
      // 在这里检查drag over的时候是这个dragover event 是否携带dataTransfer, 这个transfer的数据是否为text/plain
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
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
    dropHandler(event: DragEvent) {
      // 这个event应该存储了之前drag的element 在dragstart event里存储的数据, 也就是这个被drag的project的Id.
      console.log(event.dataTransfer!.getData('text/plain'));
      const prjId = event.dataTransfer!.getData('text/plain');
      // 触发projectState里的方法来更新project list里这个对应projrctId的projrct的status.
      projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    // drap element到这个上方后, 又移走了 触发这个方法
    @autobind
    dragLeaveHandler(_: DragEvent) {
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
}
