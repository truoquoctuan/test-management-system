import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar'; // Giả sử bạn đã cài đặt thư viện này
import Icon from '../../icons/Icon';
import { formatDate } from './FormatDate';
import ErrorForm from './ErrorForm';
import useOutsideClick from '../../hooks/useOutsideClick';

const DatePicker = ({
  label,
  name,
  placeholder,
  required,
  className = '',
  setValue,
  register,
  errors,
  setError,
  watch, // Thêm prop watch để theo dõi giá trị
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [inputDate, setInputDate] = useState('');
  const calendarRef = useRef();
  useOutsideClick(calendarRef, setShowCalendar);

  // Lắng nghe giá trị thay đổi từ React Hook Form
  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue) {
      setInputDate(watchedValue); // Đồng bộ inputDate với giá trị từ form
      const [year, month, day] = watchedValue.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setCalendarDate(date); // Đồng bộ calendarDate nếu hợp lệ
      }
    } else {
      setInputDate(''); // Reset inputDate khi giá trị là null/undefined
      setCalendarDate(new Date()); // Reset calendarDate về ngày hiện tại
    }
  }, [watchedValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputDate(value);
    // Kiểm tra định dạng yyyy/mm/dd
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (regex.test(value)) {
      const [year, month, day] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      setValue(name, value, { shouldValidate: true });

      if (!isNaN(date.getTime())) {
        setCalendarDate(date); // Cập nhật ngày khi hợp lệ
        setError(name, { message: '' }); // Reset lỗi nếu đúng định dạng
      } else {
        setError(name, { message: 'Invalid date. Please enter again.' });
      }
    } else {
      setError(name, { message: 'Please enter the correct format: yyyy/mm/dd.' });
    }
  };

  const handleCalendarChange = (date) => {
    const formattedDate = formatDate(date); // Định dạng ngày từ Calendar
    setCalendarDate(date); // Cập nhật state calendarDate
    setInputDate(formattedDate); // Cập nhật giá trị input
    setValue(name, formattedDate, { shouldValidate: true }); // Đặt giá trị vào form
    setError(name, { message: '' }); // Reset lỗi ngay lập tức
    setShowCalendar(false); // Ẩn Calendar
  };

  return (
    <div className={`flex flex-col gap-2 relative ${className}`} ref={calendarRef}>
      <label className="text-text-200 text-sm font-normal">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register(name, { required: required })}
        value={inputDate}
        onChange={handleInputChange}
        className={`${
          errors[name]
            ? 'border-red-500 shadow-[0px_0px_2px_0px_#E2483D]'
            : 'border-primary-200 shadow-[0px_0px_2px_0px_#0C66E4]'
        } h-[36px] border text-sm border-[#091E4224] placeholder:text-sm placeholder:text-[#626F86] focus:outline-none rounded px-4`}
        placeholder={placeholder || 'yyyy/mm/dd'}
      />
      <Icon
        name="Calendar"
        className="absolute top-[38px] right-3 cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      />
      {errors[name] && <ErrorForm error={errors[name].message} />}
      {showCalendar && (
        <div className="absolute bg-white right-2 z-30 bottom-12 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.15)] rounded-md">
          <Calendar className="uda-calendar" value={calendarDate} onChange={handleCalendarChange} />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
