import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TodoItem.scss';

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <div className="todo-content">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
        </div>
        <button onClick={() => deleteTodo(todo.id)} className="delete-button">
            Delete
        </button>
    </li>
);

TodoItem.propTypes = {
    todo: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
    }).isRequired,
    toggleTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
};

export default TodoItem;
