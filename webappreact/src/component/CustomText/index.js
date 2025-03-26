import React from 'react';

const CustomText = ({
    className,
    Text
}) => {
    return (
        <h3>
            <i className={className}>
            </i> {Text}
        </h3>
    );
};

export default CustomText;
