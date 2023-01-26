export function moneyFormat(number: number) {
    return new Intl.NumberFormat('el-EL', { style: 'currency', currency: 'EUR' }).format(number);
}