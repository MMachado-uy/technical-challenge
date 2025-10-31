import React, { createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/InputWithRef.scss';

const InputWithRef = ({ value, onChange, placeholder, onFocus }) => {
    const inputRef = createRef();

    useEffect(() => {
        if (inputRef && inputRef.current) {
            const element = inputRef.current;
            if (element && element.focus) {
                element.focus();
            }
        }
    }, []);

    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={handleFocus}
            className="input-with-ref"
        />
    );
};

InputWithRef.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func
};

export default InputWithRef;

