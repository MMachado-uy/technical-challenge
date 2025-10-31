import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';
import '../styles/TodoList.scss';

const TodoList = ({ todos, toggleTodo, deleteTodo }) => {
    if (todos.length === 0) {
        return <p className="empty-list">No tasks yet. Add one above!</p>;
    }

    return (
        <ul className="todo-list">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
            ))}
        </ul>
    );
};

TodoList.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired
        })
    ).isRequired,
    toggleTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
};

export default TodoList;
