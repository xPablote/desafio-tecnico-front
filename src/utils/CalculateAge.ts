export function calculateAge(birthDate: string): number | null {
    try {
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!regex.test(birthDate)) return null;

        const [day, month, year] = birthDate.split('-').map(Number);
        const birth = new Date(year, month - 1, day);
        if (isNaN(birth.getTime())) return null;

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age >= 0 ? age : null;
    } catch {
        return null;
    }
}