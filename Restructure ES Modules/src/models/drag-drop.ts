// Drag & Drop Interface
export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  // permit the drop
  dragOverHandler(event: DragEvent): void;
  // handle the drop update UI
  dropHandler(event: DragEvent): void;
  // give some feel back base on cuccess or faild of drag action.
  dragLeaveHandler(event: DragEvent): void;
}
