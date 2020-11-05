import React, { useRef, useEffect } from 'react';

import './NewTodo.css';

type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
};


// 这里specify NewTodo的类型是 React.FunctionComponent(); 然后接受NewTodoProps类型的props参数.
const NewTodo: React.FC<NewTodoProps> = props => {
  // useRef需要放入一个参数, 然后这放入的参数的类型是HTMLInputElement
  // 这里在最开始运行的时候, 给useRef的值是null, 等下面的 JSX render 后, 就会和下面的绑定
  const textInputRef = useRef<HTMLInputElement>(null);
  // 这个todoSubmitHandler是放入todoSubmitHandler里的function, 绑定给onSubmit时间, 
  // 然后会得到一个event参数, 这个参数是React.FormEvent类型.
  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault(); 
     const enteredText = textInputRef.current!.value;
    props.onAddTodo(enteredText);
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className="form-control">
        <label htmlFor="todo-text">Todo Text</label>
        <input type="text" id="todo-text" ref={textInputRef} />
      </div>
      <button type="submit">ADD TODO</button>
    </form>
  );
};

export default NewTodo;
