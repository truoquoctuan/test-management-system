import AttachFile from 'components/AttachFile/AttachFile';
import Icon from 'components/icons/icons';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

const FilterComponent = ({ filterData, onConfirm, setIsClose, setSearch, resetFillter }) => {
    const [filters, setFilters] = useState({});

    const [searchName, setSearchName] = useState({});

    const handleChange = (type, value, isCheckbox) => {
        if (isCheckbox) {
            setFilters((prev) => ({
                ...prev,
                [type]: prev[type]?.includes(value)
                    ? prev[type].filter((item) => item !== value)
                    : [...(prev[type] || []), value]
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [type]: [value]
            }));
        }
    };

    const debounceSearch = useCallback(
        debounce((type, value) => {
            setSearch((prev) => ({
                ...prev,
                [type]: value
            }));
        }, 500), // Adjust the debounce delay as needed
        []
    );

    const handleSearchChange = (type, value) => {
        debounceSearch(type, value);
        setSearchName((prev) => ({
            ...prev,
            [type]: value
        }));
    };

    const resetFilters = () => {
        setFilters({});
        setSearch({});
        setSearchName({});
        onConfirm({});
    };

    useEffect(() => {
        resetFilters();
    }, [resetFillter]);

    const confirmFilters = () => {
        onConfirm(filters);
    };

    return (
        <div className="custom-scroll-f max-h-[calc(70vh-72px)] border bg-white p-3 shadow-lg">
            <div className="flex justify-between border-b pb-2">
                <p className="text-[18px] font-bold">Filter</p>
                <div className="" onClick={() => setIsClose(false)}>
                    <Icon name="close" className="h-4 w-4 fill-black" />
                </div>
            </div>
            {filterData.map((filter, index) => (
                <div key={index}>
                    <div className="mb-2 mt-2">
                        <h3 className="my-2 text-base font-semibold">{filter.title}</h3>
                        <div className="border pt-3">
                            {filter?.options?.length > 0 ? (
                                <div className="custom-scroll-y h-full px-3">
                                    {filter?.options?.map((option, index) => (
                                        <label
                                            key={index * 5}
                                            className={`mb-4 flex ${
                                                filter.name === 'tag' || filter.name === 'resultStatus'
                                                    ? 'h-[15px]'
                                                    : 'h-[32px]'
                                            }  cursor-pointer items-center gap-1 text-sm`}
                                        >
                                            <input
                                                type={filter.type === 'checkbox' ? 'checkbox' : 'radio'}
                                                name={filter.name}
                                                value={option.value}
                                                checked={filters[filter.name]?.includes(option?.value)}
                                                onChange={() =>
                                                    handleChange(filter.name, option.value, filter.type === 'checkbox')
                                                }
                                                className="mr-2 h-4 w-4 cursor-pointer"
                                            />
                                            {option.avatar && (
                                                <AttachFile
                                                    attachType="UserAvatar"
                                                    entity="user"
                                                    seq={option.avatar}
                                                    className="h-8 w-8 rounded-full  object-cover"
                                                    keyProp={option.value}
                                                />
                                            )}
                                            {option?.color && (
                                                <p
                                                    className="mr-2 h-5 w-5"
                                                    style={{ backgroundColor: option.color }}
                                                ></p>
                                            )}
                                            <div>
                                                <p className="font-medium text-[#121212]"> {option.text}</p>
                                                {option?.userName && (
                                                    <p className="text-sm text-[#787878]"> @{option?.userName}</p>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="w-full py-2 text-center">No data</p>
                            )}
                            {filter?.filter === true && (
                                <div className="relative mt-2">
                                    <Icon name="search" className="absolute left-3 top-1.5 fill-[#787878]" />
                                    <input
                                        type="text"
                                        placeholder={`Search `}
                                        autoFocus
                                        value={searchName[filter.name] || ''}
                                        onChange={(e) => handleSearchChange(filter.name, e.target.value)}
                                        className="w-full  border-t py-1 pl-10 pr-2 placeholder:text-[13px] focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center gap-2">
                <button
                    onClick={resetFilters}
                    className="h-[32px] w-[100px] border border-[#0066CC] text-center text-sm font-bold text-[#0066CC]"
                >
                    Reset
                </button>
                <button
                    onClick={confirmFilters}
                    className="h-[32px] w-[100px] border border-[#0066CC] bg-[#0066CC] text-center text-sm font-bold text-white"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default FilterComponent;
