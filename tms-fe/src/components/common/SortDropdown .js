import { useRef, useState } from 'react';
import useOutsideClick from '../../hook/useOutsideClick';
import Icon from '../icons/icons';

const SortDropdown = ({
    options,
    selectedOption,
    onOptionSelect,
    sortOrder,
    onSortOrderChange,
    className = 'flex',
    placeholder = 'Created'
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleSortOrder = () => {
        if (sortOrder === 'asc') {
            onSortOrderChange('desc');
        } else {
            onSortOrderChange('asc');
        }
    };

    const selectOption = (option) => {
        onOptionSelect(option);
        setIsDropdownOpen(false);
    };
    const modalRef = useRef(null);
    useOutsideClick(modalRef, setIsDropdownOpen);
    return (
        <div className={className} ref={modalRef}>
            <div className="relative inline-block h-full w-full text-left ">
                <div
                    className="flex h-full cursor-pointer items-center justify-between  border border-[#B3B3B3] px-3 focus:border-blue-600 focus:outline-none"
                    onClick={toggleDropdown}
                >
                    <p className=" py-1 text-sm">
                        {selectedOption ? (
                            <span>{selectedOption.name}</span>
                        ) : (
                            <span className="text-[#B3B3B3]">{placeholder}</span>
                        )}
                    </p>

                    <Icon name="down" className={`h-3 w-3 transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full  border border-gray-300 bg-white shadow-lg">
                        <div className="py-1">
                            {options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => selectOption(option)}
                                    className={`cursor-pointer px-4 py-2 text-sm ${
                                        selectedOption === option
                                            ? 'bg-[#F4F4F4] text-black'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div
                className=" flex w-[32px] cursor-pointer items-center justify-center border-y border-r  border-[#B3B3B3] "
                onClick={toggleSortOrder}
            >
                {sortOrder === 'desc' ? (
                    <Icon name="sort_ascending" className="" />
                ) : (
                    <Icon name="sort_descending" className="" />
                )}
            </div>
        </div>
    );
};

export default SortDropdown;
