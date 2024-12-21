export type ItineraryRequestModel = {
    destination: string;
    lat: string;
    lon: string;
    startDate: string;
    endDate: string;
    preferences?: string | null | undefined;
};
