export function calculateStartOfDate(date: Date) {
    const now = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getMinutes(), date.getSeconds())
}