import { useRef, useState } from 'react';
import useOutsideClick from '../../hook/useOutsideClick';
import Icon from '../icons/icons';

const FilterSelection = ({ data, value, setValue, className, setCurrentPage }) => {
    const [isOpen, setIsopen] = useState(false);

    const handleFilterByStatus = (newValue) => {
        setValue(newValue);
        setCurrentPage(1);
    };

    const modalRef = useRef(null);
    useOutsideClick(modalRef, setIsopen);

    return (
        <div className={`relative ${className}`} ref={modalRef}>
            <Icon
                name="keyboard_arrow_down"
                className={`absolute right-1 top-1/2 -translate-y-1/2 fill-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                }`}
            />

            <div
                className="rounded-default cursor-pointer border px-3 py-1 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.08)]"
                onClick={() => setIsopen(!isOpen)}
            >
                {value
                    ? data?.options?.map((item, index) => {
                          return <p key={index}>{value === item?.value && item?.text}</p>;
                      })
                    : data?.placeholder}
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-[250px] w-full overflow-y-auto rounded-md border bg-white p-2">
                    {data?.options?.map((item, index) => {
                        return (
                            <p
                                key={index}
                                className={`border-b p-2 last:border-none ${
                                    value === item?.value
                                        ? 'text-secondary-800 font-bold'
                                        : 'hover:bg-secondary-200 cursor-pointer'
                                }`}
                                onClick={() => {
                                    if (value !== item?.value) {
                                        handleFilterByStatus(item?.value);
                                        setIsopen(false);
                                    }
                                }}
                            >
                                {item?.text}
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterSelection;
