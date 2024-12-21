type DayEntry = {
    is_overnight: boolean;
    start: string;
    end: string;
    day: number;
};

type BusinessHours = {
    open: DayEntry[];
    hours_type: string;
    is_open_now: boolean;
}[];

// Convert 24-hour time to 12-hour AM/PM format
const convertTo12Hour = (time: string): string => {
    const hour = parseInt(time.substring(0, 2), 10);
    const minute = time.substring(2);
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute} ${period}`;
};

export function parseBusinessHours(businessHours: BusinessHours): string {
    if (!businessHours?.length) return 'Unknown'; // or 'No business hours available'
    const daysMap = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const timeSlots: { [key: string]: string[] } = {};
    let isOpen247 = true;

    // Process each day's schedule
    businessHours[0].open.forEach((entry) => {
        const day = daysMap[entry.day];
        const start = entry.start;
        const end = entry.end;

        // Check if open 24/7
        if (!(entry.is_overnight && start === '0000' && end === '0000')) {
            isOpen247 = false; // Not 24/7 if any day doesn't meet the criteria
        }

        const startTime = convertTo12Hour(start);
        const endTime = convertTo12Hour(end);
        const timeRange = `${startTime} - ${endTime}`;

        // Group by time slots
        if (!timeSlots[timeRange]) {
            timeSlots[timeRange] = [];
        }
        timeSlots[timeRange].push(day);
    });

    // Summarize output
    const summary: string[] = [];
    Object.keys(timeSlots).forEach((timeRange) => {
        const days = timeSlots[timeRange].join(', ');
        summary.push(`${days}: ${timeRange}`);
    });

    if (isOpen247) {
        summary.length = 0; // clear array
        summary.unshift('24/7');
    }

    return summary.join('; ');
}

function convertPrice(price: string | undefined): string {
    const priceMap: { [key: string]: string } = {
        $: 'Inexpensive',
        $$: 'Moderate',
        $$$: 'Pricey',
        $$$$: 'Very Expensive',
    };
    return price ? priceMap[price] : 'Unknown';
}

export function parseYelpBusinesses(items: any[]) {
    return items.map((item) => {
        // const categories = (item.categories || [])
        //     .map((category: any) => category.title)
        //     .join(', ');
        return {
            name: item.name,
            rating: item.rating,
            review_count: item.review_count,
            // categories,
            // coordinates
            location:
                item.location?.display_address?.join(', ') ||
                item.location?.address1 ||
                '',
            // phone: item.display_phone || item.phone,
            // distance: item.distance,
            price: convertPrice(item.price),
            open: parseBusinessHours(item.business_hours),
        };
    });
}

export function parseYelpBusinessesAsString(items: any[]) {
    return items
        .map((item, index) => {
            return `${index + 1}. Name: ${item.name} (${item.rating} stars, ${
                item.review_count
            } reviews) - Address: ${item.location} - Business Hours: ${
                item.open
            } - Price: ${item.price}.`;
        })
        .join('\n');
}

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
