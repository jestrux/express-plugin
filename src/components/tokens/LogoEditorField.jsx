import React from 'react';
const logoList = Array(5).fill('fa').map((_, i) => `images/logos/${i+1}.png`);

const LogoEditorField = ({
    onChange
}) => {
    return (
        <div className="flex flex-wrap -mx-12px bg-light-gray">
            {logoList.map((logo, index) => {
                return (
                    <div key={index} className="cursor-pointer parent relative flex-shrink-0 font-bold text-center bg-gray-100 overflow-hidden relative flex flex-col center-center"
                        style={{ width: "50%", border: "solid #e5e5e5", borderWidth: "0 1px 1px 0" }}
                        onClick={() => onChange(index + 1)}
                    >
                        <div className="flex center-center" style={{ height: "45px" }}>
                            <img loading="lazy" className="object-contain object-center w-full"
                                src={logo} alt=""
                                style={{ maxWidth: "80%",  maxHeight: "35px" }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LogoEditorField;