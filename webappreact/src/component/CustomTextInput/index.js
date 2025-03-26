import React from 'react';
import './style.css';

const CustomTextInput = ({
    id,
    rows,
    cols,
    placeholder,
}) => {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            {...(rows && { rows })}
            {...(cols && { cols })}
        ></textarea>
    );
};

export default CustomTextInput;
