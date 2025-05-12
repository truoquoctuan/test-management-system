import React, { useCallback, useEffect, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import Icon from '../../icons/Icon';
import { debounce } from 'lodash';

const SearchFilter = ({ searchTerm, setSearchTerm, setCurrentPage, dataClickFilter, setDataClickFilter }) => {
  const inputRef = useRef(null);
  const [isOpenfilters, setIsOpenFilters] = useState(false);
  const [dataFilter, setDataFilter] = useState(null);
  const [isOpenSubFilter, setIsOpenSubFilter] = useState(false);
  const filterRef = useRef();
  const subFilterRef = useRef();

  useOutsideClick(filterRef, setIsOpenFilters);
  useOutsideClick(subFilterRef, setIsOpenSubFilter);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchTerm(value);
    }, 500),
    []
  );

  const handleInputSearch = (event) => {
    const value = event.target.value.trim();
    debounceSearch(value);
  };

  useEffect(() => {
    if (searchTerm === '' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [searchTerm]);
  // Dữ liệu mẫu
  const data = [
    {
      id: 1,
      value: 'Status',
      realize: 'enabled',
      selectedValue: { id: 1, name: 'Activate' },
      dataType: 'Object',
      filterBy: [
        { id: 1, name: 'Activate' },
        { id: 0, name: 'Inactive' },
      ],
    },
    {
      id: 2,
      value: 'Created at',
      realize: 'createdTimestamp',
      selectedValue: { id: 1, name: 'Newest', status: 'createdTimestamp+asc' },
      dataType: 'Object',
      filterBy: [
        { id: 1, name: 'Newest', status: 'createdTimestamp+asc' },
        { id: 2, name: 'Oldest', status: 'createdTimestamp+desc' },
      ],
    },
  ];

  const handleClickValue = (item) => {
    const checkId = dataClickFilter?.some((idValue) => idValue.id === item.id);
    setCurrentPage(1);
    if (!checkId) {
      setDataClickFilter((prev) => {
        return [...prev, item];
      });
    } else {
      setDataClickFilter((prev) => prev.filter((idValue) => idValue.id !== item.id));
    }
  };

  const handleSelectFilterObject = (item, id) => {
    setDataClickFilter((prevData) =>
      prevData.map((entry) => (entry.id === id ? { ...entry, selectedValue: item } : entry))
    );
    setCurrentPage(1);
  };
  const handleSelectFilterArray = (item, id) => {
    setDataClickFilter((prevData) =>
      prevData.map((entry) => {
        if (entry.id === id) {
          const isSelected = entry.selectedValue.find((val) => val.id === item.id);
          return {
            ...entry,
            selectedValue: isSelected
              ? entry.selectedValue.filter((val) => val.id !== item.id) // Xóa nếu đã tồn tại
              : [...entry.selectedValue, item], // Thêm nếu chưa tồn tại
          };
        }
        return entry;
      })
    );
    setCurrentPage(1);
  };

  return (
    <div className="">
      <div className="flex items-center flex-wrap gap-3 " ref={subFilterRef}>
        {/* Ô tìm kiếm */}
        <div className="w-[30%] relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            defaultValue={searchTerm}
            onChange={handleInputSearch}
            className=" w-full h-[32px] pr-2 pl-8 border border-[#091E424F] rounded-md focus:outline-none  focus:border-[#091E42] placeholder:text-sm"
          />
          <Icon name="Search" className="absolute left-2 top-2" />
        </div>

        {/* Các filter đã được chọn */}
        {dataClickFilter?.map((item, index) => {
          return (
            <div key={index} className="relative">
              <div className="flex bg-slate-100 px-2 h-[32px] rounded-md items-center gap-3 ">
                <p
                  className="min-w-[100px] cursor-pointer text-text-200  text-sm font-normal"
                  onClick={() => {
                    setDataFilter(item);
                    setIsOpenSubFilter(true);
                  }}
                >
                  {item?.value} :{' '}
                  {item.dataType === 'Array'
                    ? item?.selectedValue?.map((entry) => entry?.name).join(', ')
                    : item?.selectedValue?.name}
                </p>
              </div>
              {dataFilter?.id === item.id && isOpenSubFilter === true && (
                <div className="absolute border rounded-md min-w-[150px] top-9  bg-white z-30">
                  {dataFilter?.filterBy?.map((entry, index) => {
                    return (
                      <div
                        className="hover:bg-[#A1BDD914]"
                        key={index}
                        onClick={() => {
                          item.dataType === 'Array'
                            ? handleSelectFilterArray(entry, dataFilter.id)
                            : handleSelectFilterObject(entry, dataFilter.id);
                        }}
                      >
                        <p className="px-3 py-1.5 cursor-pointer text-sm">{entry?.name}</p>
                      </div>
                    );
                  })}
                  <div
                    onClick={() => handleClickValue(item)}
                    className="cursor-pointer pt-1 text-sm text-primary-200 border-t px-3 py-2"
                  >
                    Clear selection
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Filter  */}
        <div className="relative" ref={filterRef}>
          <p
            className="text-primary-200 w-[200px] cursor-pointer  font-medium text-sm"
            onClick={() => {
              setIsOpenFilters(!isOpenfilters);
              setIsOpenSubFilter(false);
            }}
          >
            Add filter
          </p>
          {isOpenfilters && (
            <div>
              <div className="min-h-[40px] min-w-[150px]  rounded-md  border absolute top-7  bg-white z-30">
                {data
                  ?.filter(
                    (item1) => !dataClickFilter.some((item2) => item1.id === item2.id && item1.value === item2.value)
                  )
                  ?.map((item, index) => {
                    return (
                      <div key={index}>
                        <p
                          className="w-full py-2 px-3 hover:bg-slate-100 cursor-pointer text-sm font-normal"
                          onClick={() => handleClickValue(item)}
                        >
                          {item?.value}
                        </p>
                      </div>
                    );
                  })}
                {dataClickFilter.length > 0 && (
                  <div
                    onClick={() => {
                      setDataClickFilter([]);
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer hover:bg-slate-100 text-sm text-primary-200  py-2 px-3"
                  >
                    Clear all
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
