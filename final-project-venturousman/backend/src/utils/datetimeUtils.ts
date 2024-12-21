export function convertUnixToUTC(unixTimestamp: number): string {
    // Multiply by 1000 to convert seconds to milliseconds
    const date = new Date(unixTimestamp * 1000);
    // Convert to ISO string and ensure UTC format
    return date.toISOString();
}

export const calculateDaysBetween = (
    startDate: string,
    endDate: string,
): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = end.getTime() - start.getTime();

    // Convert milliseconds to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    return diffInDays;
};
