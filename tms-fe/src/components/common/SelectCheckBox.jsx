import Icon from 'components/icons/icons';
import { useState } from 'react';

const SelectCheckBox = (props) => {
    const { placeholder, options } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div
                type="button"
                className="flex h-8 w-[200px] cursor-pointer items-center justify-between border border-neutral-4 px-4 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="overflow-hidden text-ellipsis whitespace-nowrap py-1 text-sm">
                    <span className="text-neutral-4">{placeholder}</span>
                </div>

                <Icon name="down" className={`h-3 w-3 transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute  z-10 mt-2 w-full  border border-gray-300 bg-white shadow-lg">
                    <ul className="py-1">
                        {options?.map((option) => (
                            <li
                                key={option?.id}
                                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <input type="checkbox" value={option?.value} className="mr-2" />

                                <span className="">{option?.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectCheckBox;
