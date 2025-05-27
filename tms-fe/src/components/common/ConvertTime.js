export const toDateStrings = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
};
export const toDateTimeString = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = ` ${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    return formattedDateTime;
};
export const formatTime = (time) => {
    const now = new Date();
    const givenTime = new Date(time);
    const diffInSeconds = Math.floor((now - givenTime) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (diffInSeconds < 259200) {
        const days = Math.floor(diffInSeconds / 86400);
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
        return givenTime.toLocaleString();
    }
};
