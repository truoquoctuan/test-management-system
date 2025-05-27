import Icon from 'components/icons/icons';
import { useRef, useState } from 'react';
import useOutsideClick from '../../hook/useOutsideClick';

const Select = (props) => {
    const { options, placeholder, selected } = props;
    const modalRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(selected ? selected : null);

    useOutsideClick(modalRef, setIsDropdownOpen);

    const handleToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOption = (option) => {
        setSelectedValue(option);
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative inline-block w-full text-left">
            <div
                ref={modalRef}
                onClick={handleToggle}
                className="flex cursor-pointer items-center justify-between gap-x-2 border border-neutral-4 px-3 py-1"
            >
                <div>{selectedValue?.name || <div className="text-neutral-4">{placeholder}</div>}</div>

                <Icon
                    name="down_2"
                    className={`h-4 w-4 fill-neutral-4 transition-all duration-100 ${
                        isDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
            </div>

            {isDropdownOpen && (
                <ul ref={modalRef} className="absolute z-10 mt-2 w-full border border-neutral-4 bg-white shadow-lg ">
                    {options?.map((option, index) => {
                        return (
                            <li
                                key={index}
                                className="cursor-pointer px-4 py-2 text-sm text-neutral-3 hover:bg-gray-100"
                                onClick={() => {
                                    handleOption(option);
                                }}
                            >
                                {option?.name}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
export default Select;
