import React from 'react';

const ButtonCustom = ({
    id,
    className,
    style,
    children,
    disabled = false,
    ...props
}) => {
    return (
        <button
            id={id}
            className={className}
            style={style}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default ButtonCustom;