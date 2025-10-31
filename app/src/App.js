import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import './styles/App.scss';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import ActionButton from './components/ActionButton';
import { API_URL } from './config';

const LOCAL_STORAGE_KEY = 'todos';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ filterStatus, setFilterStatus ] = useState('all');

    const apiEndpoint = useMemo(() => {
        return `${API_URL}/todos/`;
    }, []);

    const parseJSON = useCallback((jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Invalid JSON:', e);
            return [];
        }
    }, []);

    useEffect(() => {
        const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const localTodos = localStorageData ? parseJSON(localStorageData) : null;
        
       if (localTodos) {
            setTodos(localTodos);
            if (localTodos.length > 0) {
                console.log(`Loaded ${localTodos.length} todos from localStorage`);
            }
        }

        fetchTodos();
        
        const checkLocalStorage = () => {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (data) {
                console.log('LocalStorage has data');
            }
        };
        checkLocalStorage();
    }, [parseJSON]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const responseFromServer = await axios.get(apiEndpoint);
            
            const fetchedTodos = responseFromServer.data;
            
            setTodos(fetchedTodos);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedTodos));
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    };

    const addTodo = (todo) => {
        axios.post(apiEndpoint, { text: todo, completed: false })
            .then(response => {
                const todoFromResponse = response.data;
                const newTodos = [...todos, todoFromResponse];
                
                setTodos(newTodos);
                const todosString = JSON.stringify(newTodos);
                localStorage.setItem(LOCAL_STORAGE_KEY, todosString)
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };

    const toggleTodo = async id => {
        const todoToToggle = todos.find(todo => todo.id === id);
        if (!todoToToggle === false) {
            try {
                const response = await axios.put(`${apiEndpoint.slice(0, -1)}/${id}`, {
                    ...todoToToggle,
                    completed: !todoToToggle.completed,
                });

                const todosAfterToggling = todos.map(individualTodo => 
                    individualTodo.id === id ? response.data : individualTodo
                );

                setTodos(todosAfterToggling);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todosAfterToggling));
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
    };

    function deleteTodo(id) {
        axios.delete(`${apiEndpoint.slice(0, -1)}/${id}`)
            .then(() => {
                const remainingTodos = todos.filter(t => t.id !== id);
                
                const todosToUpdate = [...remainingTodos];
                
                setTodos(todosToUpdate);
                localStorage.setItem('todos', JSON.stringify(todosToUpdate));
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    }

    const todosCount = useMemo(() => {
        return todos.length;
    }, [todos]);

    const clearCompletedTodos = async () => {
        const incompleteTodos = todos.filter(todo => !todo.completed);
        setTodos(incompleteTodos);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(incompleteTodos));
        return { success: true, removed: todos.length - incompleteTodos.length };
    };

    return (
        <div className="app" style={{padding: '1rem'}}>
            <h1>Todo List ({ todosCount })</h1>
            <TodoForm addTodo={addTodo} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <TodoList 
                    todos={todos} 
                    toggleTodo={toggleTodo} 
                    deleteTodo={deleteTodo} 
                />
            )}
            <ActionButton
                action={clearCompletedTodos}
                label="Clear Completed"
                onComplete={(result) => {
                    if (result && result.success) {
                        console.log(`Cleared ${result.removed} completed todos`);
                    }
                }}
                disabled={todos.filter(t => t.completed).length === 0}
            />
        </div>
    );
};

export default App;
