import React from 'react';

function ButtonGroup({choices = [], onChange, ...props}){
    return (
        <div className="inline-flex border bg-white rounded-xs overflow-hidden"
            style={{padding: "0.1rem"}}
        >
            { choices.map((choice, index) => {
                const isObject = typeof choice == "object";
                const label = isObject ? choice.label : choice;
                const value = isObject ? choice.value : choice;
                const selected = props.value == value;

                return (
                    <span key={index} className={`cursor-pointer py-1 px-2 ${index < choices.length - 1 && `border-r`} ${selected ? 'bg-dark-gray text-white' : 'text-dark-gray'}`}
                        onClick={() => onChange(value, index)}
                    >
                        { label.toString().toUpperCase() }
                    </span>
                )
            }) }
        </div>
    );
}
export default ButtonGroup;