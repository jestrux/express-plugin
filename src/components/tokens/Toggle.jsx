import React from 'react';

function Toggle({checked, onChange}){
    return (
        <div className={`cursor-pointer flex border ${checked ? 'border-dark-gray bg-blue' : 'bg-black26 border-gray'}`}
            style={{width: "34px", padding: "1.5px", borderRadius: "28px"}}
            onClick={() => onChange(!checked)}
        >
            <div className={`rounded-full bg-white border border-darkgray ${checked && 'ml-auto'}`}
                style={{width: "14px", height: "14px"}}
            >
            </div>
        </div>
    );
}
export default Toggle;