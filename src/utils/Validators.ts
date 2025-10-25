export function validateRut(rut: string): boolean {
    const regex = /^\d{1,8}-[\dkK]$/;
    if (!regex.test(rut)) return false;

    const [number, digit] = rut.split('-');
    let sum = 0;
    let multiplier = 2;

    for (let i = number.length - 1; i >= 0; i--) {
        sum += parseInt(number[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;
    const checkDigit = 11 - remainder;
    const expectedDigit = checkDigit === 11 ? '0' : checkDigit === 10 ? 'K' : checkDigit.toString();

    return expectedDigit.toLowerCase() === digit.toLowerCase();
}