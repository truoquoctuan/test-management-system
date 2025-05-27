/**
 * Formats a date string according to the given format.
 * @param {string} format - The desired date format (e.g., "dd-mm-yyyy", "dd-mm", "hh:mm:ss dd-mm-yyyy").
 * @param {string} inputDate - The input date string (e.g., "2024-06-21T09:34:11").
 * @returns {string} - The formatted date string.
 */
const formatDate = (format, inputDate) => {
    if (!inputDate) {
        return format;
    }

    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year)
        .replace('hh', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);

    return formattedDate;
};

export default formatDate;
