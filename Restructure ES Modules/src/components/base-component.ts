// Component Base Class

// 定义abstract class 然后包含主要的render方法, 给下面两个方法继承
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

