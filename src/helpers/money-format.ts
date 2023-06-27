export function moneyFormat(number: number) {
    return new Intl.NumberFormat('en-EL', { style: 'currency', currency: 'EUR' }).format(number);
}
