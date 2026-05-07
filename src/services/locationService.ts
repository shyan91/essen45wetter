export interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
}

export async function fetchUserLocation(): Promise<LocationData> {
    try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();

        return {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            city: data.city || 'Unbekannt'
        };
    } catch (err) {
        console.warn('Could not fetch IP location, falling back to default location', err);
        // Fallback to Essen if location fetch fails
        return {
            latitude: 51.4556,
            longitude: 7.0116,
            city: 'Essen'
        };
    }
}
