export const formatDate = (date) => {
  const data = new Date(date);
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const formatDateForm = (date) => {
  const data = new Date(date);
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
};
export const formatTime = (date) => {
  const data = new Date(date);
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateFormUpdate = (date) => {
  const data = new Date(date);
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const formatDateTime2 = (date) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};
