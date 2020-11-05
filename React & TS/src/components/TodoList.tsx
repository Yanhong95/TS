import React from 'react';

import './TodoList.css';

interface TodoListProps {
  items: { id: string; text: string }[];
  onDeleteTodo: (id: string) => void;
}

// 这里specify TodoList的类型是 React.FunctionComponent(); 然后接受TodoListProps类型的props参数.
// 这里的TodoListProps也包含很多本来就能传过来的props. 其实是type合并了.
const TodoList: React.FC<TodoListProps> = props => {
  return (
    <ul>
      {props.items.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={props.onDeleteTodo.bind(null, todo.id)}>
            DELETE
          </button>
        </li>
      ))} 
    </ul>
  );
};

export default TodoList;
