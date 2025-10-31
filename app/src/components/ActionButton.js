import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ActionButton.scss';

const ActionButton = ({ action, onComplete, label, disabled }) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        if (disabled || isPending) return;

        setIsPending(true);
        setError(null);

        try {
            const result = await action();
            if (onComplete) {
                onComplete(result);
            }
        } catch (err) {
            setError(err?.response?.data?.error?.message || err.message || 'An error occurred');
            console.error('Action error:', err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="action-button-wrapper">
            <button
                onClick={handleClick}
                disabled={disabled || isPending}
                className={`action-button ${isPending ? 'pending' : ''}`}
            >
                {isPending ? 'Processing...' : label}
            </button>
            {error && <span className="action-error">{error}</span>}
        </div>
    );
};

ActionButton.propTypes = {
    action: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default ActionButton;

