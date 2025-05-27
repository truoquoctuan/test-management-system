import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import Icon from '../icons/icons';

const SearchInput = ({ setCurrentPage, setSearch, inputValue, className, placeholder, maxLength }) => {
    const inputRef = useRef(null);

    const debounceSearch = useCallback(
        debounce((value) => {
            setCurrentPage(0);
            setSearch(value);
        }, 500), // Adjust the debounce delay as needed
        []
    );

    const handleInputSearch = (event) => {
        const value = event.target.value.trim();
        if (value.length <= maxLength) {
            debounceSearch(value);
        }
    };

    // Reset the input field when inputValue is empty
    useEffect(() => {
        if (inputValue === '' && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [inputValue]);

    return (
        <div className={`${className} relative flex`}>
            <Icon name="search" className="absolute left-2 ml-1 mt-1 fill-[#868686] focus:fill-blue-600" />
            <input
                ref={inputRef}
                placeholder={placeholder}
                onChange={handleInputSearch}
                defaultValue={inputValue}
                maxLength={maxLength}
                className="w-full border border-[#B3B3B3] py-[2px] pl-10 placeholder:text-sm placeholder:font-light focus:border-blue-600  focus:outline-none"
            />
        </div>
    );
};

export default SearchInput;
