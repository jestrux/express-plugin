import React from 'react';

const defaultSections = [
    {
        label: "Content",
        icon: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z",
    },
    {
        label: "Styles",
        icon: "M12,4.81L12,19c-3.31,0-6-2.63-6-5.87c0-1.56,0.62-3.03,1.75-4.14L12,4.81 M12,2L6.35,7.56l0,0C4.9,8.99,4,10.96,4,13.13 C4,17.48,7.58,21,12,21c4.42,0,8-3.52,8-7.87c0-2.17-0.9-4.14-2.35-5.57l0,0L12,2z",
    },
    {
        label: "Presets",
        icon: "M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M5,19V5h6v14H5z M19,19h-6v-7h6V19z M19,10h-6V5h6V10z",
    }
];

const SectionTitles = function({sections = defaultSections, currentSection, onChange}){
    const titleItems = () => sections.map((section, index) => {
        const selected = currentSection == section.label;
        const iconSize = index == 1 ? '17px' : '16px';
        const styles = {
            fontSize: "0.75rem",
            color: selected ? "#444" : '#888',
            borderColor: selected ? "#888" : 'transparent',
            paddingLeft: "3px",
            paddingRight: "8px"
        };

        return (
            <div key={index} className="cursor-pointer flex flex-wrap justify-center items-center border-b-2 border-dark-gray mr-3 pb-2"
                style={styles}
                onClick={() => onChange(section.label)}
            >
                <svg className="mr-1" width={iconSize} viewBox="0 0 24 24">
                    <path fill={selected ? '#555' : '#888'} d={section.icon} />
                </svg>
                {section.label}
            </div>
        );
    });

    return (
        <div className="flex items-center">
            { titleItems() }
        </div>
    );
}

export default SectionTitles;