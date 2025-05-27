export const toDateStrings = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
};
export const toDateStringYear = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};
export const toDateStringHMS = (date) => {
    const currentDate = new Date(date);
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${hours}:${minutes}:${seconds}`;
    return formattedDate;
};

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();

    // Kiểm tra nếu ngày là hôm nay
    const isToday = date.toDateString() === now.toDateString();

    // Kiểm tra nếu ngày là hôm qua
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Chuyển đổi thời gian thành dạng 12 giờ
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Giờ 0 phải là 12

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedTime = hours + ':' + formattedMinutes + ' ' + ampm;

    if (isToday) {
        return `Today ${formattedTime}`;
    } else if (isYesterday) {
        return `Yesterday ${formattedTime}`;
    } else {
        // Nếu không phải hôm nay hoặc hôm qua, định dạng ngày và thời gian đầy đủ
        const formattedDate = date.toLocaleDateString();
        return `${formattedTime} ${formattedDate}`;
    }
};
