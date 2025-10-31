import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const FormWrapper = forwardRef((props, ref) => {
    const { children, onSubmit, className } = props;
    
    useImperativeHandle(ref, () => ({
        focus: () => {
            console.log('Form wrapper focused');
        },
        reset: () => {
            console.log('Form wrapper reset');
        }
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form className={className} onSubmit={handleSubmit}>
            {children}
        </form>
    );
});

FormWrapper.displayName = 'FormWrapper';

FormWrapper.propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func,
    className: PropTypes.string
};

export default FormWrapper;

