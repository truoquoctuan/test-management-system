export function checkFileFormat(fileName) {
    const extension = fileName.split('.').pop(); // Get the file extension
    if (extension === 'docx') {
        return 'docx';
    } else if (extension === 'pdf') {
        return 'pdf';
    } else if (extension === 'doc') {
        return 'doc';
    } else if (extension === 'xlsx') {
        return 'xlsx';
    } else if (extension === 'zip') {
        return 'zip';
    } else if (extension === 'rar') {
        return 'rar';
    } else if (extension === 'pptx') {
        return 'pptx';
    } else if (extension === 'txt') {
        return 'txt';
    } else if (extension === 'csv') {
        return 'csv';
    } else {
        return 0;
    }
}
