export const ColorChecker = (color) => {
    // Hàm chuyển đổi màu từ HEX sang RGB
    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, '');

        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((hexChar) => hexChar + hexChar)
                .join('');
        }

        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return [r, g, b];
    };

    // Hàm xử lý màu RGB dạng chuỗi "rgb(r, g, b)"
    const rgbStringToRgb = (rgbString) => {
        const [r, g, b] = rgbString
            .replace(/[^\d,]/g, '')
            .split(',')
            .map(Number);
        return [r, g, b];
    };

    // Hàm kiểm tra độ sáng hoặc tối của màu
    const isLightOrDark = (r, g, b) => {
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 127.5 ? 'light' : 'dark';
    };

    // Xác định định dạng của màu và chuyển đổi về RGB
    let rgb = null;
    if (color?.startsWith('#')) {
        // Nếu màu là dạng HEX
        rgb = hexToRgb(color);
    } else if (color?.startsWith('rgb')) {
        // Nếu màu là dạng RGB
        rgb = rgbStringToRgb(color);
    } else {
        console.error('Invalid color format');
    }

    // Kiểm tra nếu rgb đã được gán giá trị hợp lệ
    if (!rgb) {
        return 'Invalid color format';
    }

    // Tính toán tông màu
    const [r, g, b] = rgb;
    const tone = isLightOrDark(r, g, b);

    return tone;
};
