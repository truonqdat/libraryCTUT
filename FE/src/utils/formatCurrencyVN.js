export const formatCurrencyVN = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal', // Thay đổi kiểu thành decimal
    }).format(amount) + 'đ'; // Thêm " VND" vào cuối
};
