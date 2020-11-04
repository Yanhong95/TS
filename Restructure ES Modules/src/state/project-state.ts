namespace App {

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
  export class ProjectState extends State<Project> {

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
    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find(proj => proj.id === projectId);
      // 当project status 不同的时候我们再re-render这个list.
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateProject();
      }
    }

    //对project array 执行listener array里的所有方法.
    private updateProject() {
      for (const listenerFn of this.listeners) {
        // 传递shallow copy
        listenerFn(this.projects.slice());
      }
    }

  }

  export const projectState = ProjectState.getInstance();
}