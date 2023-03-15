import React from 'react';
 
const Loader = ({absolute, onCancel}) => {
    return (
        <div className={`${absolute ? 'absolute' : 'fixed'} inset-0 z-20 bg-black70 text-white flex flex-col center-center`}
            style={{left: "-12px", right: "-12px", bottom: "-12px", top: "-12px",}}
        >
            <img width="80px" src="images/spinner.gif" />

            {
                typeof onCancel == "function" && (
                    <div uxp-variant="cta" className="cursor-pointer mt-4 rounded py-2 px-3 text-white border border-current"
                        onClick={onCancel}
                    >
                        CANCEL
                    </div>
                )
            }
        </div>
    );
}

export default Loader;