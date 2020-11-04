export default class Component {
    constructor(templateElement, hostElement, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateElement);
        this.hostElement = document.getElementById(hostElement);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
//# sourceMappingURL=base-component.js.map