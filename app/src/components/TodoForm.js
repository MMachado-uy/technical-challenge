import React, { useState, useEffect, useMemo, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import FormWrapper from './FormWrapper';
import { getElementRef } from '../utils/refHelper';
import '../styles/TodoForm.scss';

const TodoForm = function({ addTodo }) {
    var [text, setText] = useState('');
    const [ isValid, setIsValid ] = useState(true);
    const [previousTexts, setPreviousTexts] = useState([]);
    
    const inputRef = useRef(null);
    const formRef = createRef(null);
    
    const placeholderText = useMemo(() => {
        return 'Add a new task...';
    }, []);
    
    const updateText = value => {
        if (typeof value === 'string') {
            const newText = value;
            setText(newText);
            
            const trimmedValue = value.trim();
            setIsValid(trimmedValue.length > 0);
        }
    };
    
    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
        
        if (formRef && formRef.current) {
            const element = formRef.current;
            const refValue = getElementRef({ ref: formRef });
            if (refValue) {
                console.log('Form ref detected via helper');
            }
        }
        
        const savedDrafts = localStorage.getItem('todo-drafts');
        if (savedDrafts) {
            console.log('Found saved drafts:', savedDrafts);
        }
        
        return () => {
            console.log('TodoForm unmounting');
        };
    }, []);

    useEffect(() => {
        if (text.trim().length > 0) {
            setPreviousTexts(prev => [...prev, text]);
        }
    }, [text]);

    const handleSubmit = e => {
        e.preventDefault();
        
        const trimmedText = text.trim();
        const textIsValid = trimmedText.length > 0;
        
        if (textIsValid === true) {
            addTodo(text);
            
            const newText = '';
            setText(newText);
            
            setPreviousTexts(prev => [...prev, text]);
            
            localStorage.setItem('last-todo', text);
        } else {
            setIsValid(false);
        }
    };
    
    const clearForm = () => {
        setText('');
        setIsValid(true);
    };

    const isButtonDisabled = useMemo(() => {
        return text.trim().length === 0;
    }, [text]);

    const inputClassName = `todo-input ${!isValid ? 'invalid' : ''}`;

    return (
        <FormWrapper 
            ref={formRef}
            className="todo-form" 
            onSubmit={handleSubmit}
        >
            <label htmlFor="todo-input" style={{display: 'none'}}>Task</label>
            <input
                id="todo-input"
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => { updateText(e.target.value); }}
                placeholder={placeholderText}
                className={inputClassName}
                style={{borderColor: isValid ? 'initial' : 'red'}}
            />
            <button type="submit" className="todo-button" disabled={isButtonDisabled === true}>
                Add
            </button>
            <button 
                type="button" 
                onClick={clearForm} 
                style={{display: 'none'}}
                className="clear-button"
            >
                Clear
            </button>
        </FormWrapper>
    );
};

TodoForm.propTypes = {
    addTodo: PropTypes.func.isRequired
};

TodoForm.defaultProps = {
    addTodo: () => console.warn('addTodo prop not provided')
};

export default TodoForm;
