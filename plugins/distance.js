const CITIES = {
    // Pakistan
    karachi: { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lon: 67.0011, flag: '🇵🇰' },
    lahore: { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lon: 74.3587, flag: '🇵🇰' },
    islamabad: { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lon: 73.0479, flag: '🇵🇰' },
    rawalpindi: { name: 'Rawalpindi', country: 'Pakistan', lat: 33.5651, lon: 73.0169, flag: '🇵🇰' },
    faisalabad: { name: 'Faisalabad', country: 'Pakistan', lat: 31.4504, lon: 73.1350, flag: '🇵🇰' },
    peshawar: { name: 'Peshawar', country: 'Pakistan', lat: 34.0151, lon: 71.5249, flag: '🇵🇰' },
    quetta: { name: 'Quetta', country: 'Pakistan', lat: 30.1798, lon: 66.9750, flag: '🇵🇰' },
    multan: { name: 'Multan', country: 'Pakistan', lat: 30.1575, lon: 71.5249, flag: '🇵🇰' },
    hyderabad: { name: 'Hyderabad', country: 'Pakistan', lat: 25.3960, lon: 68.3578, flag: '🇵🇰' },
    gujranwala: { name: 'Gujranwala', country: 'Pakistan', lat: 32.1877, lon: 74.1945, flag: '🇵🇰' },
    // India
    mumbai: { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, flag: '🇮🇳' },
    delhi: { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090, flag: '🇮🇳' },
    bangalore: { name: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946, flag: '🇮🇳' },
    chennai: { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, flag: '🇮🇳' },
    kolkata: { name: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639, flag: '🇮🇳' },
    hyderabadin: { name: 'Hyderabad (IN)', country: 'India', lat: 17.3850, lon: 78.4867, flag: '🇮🇳' },
    // Middle East
    dubai: { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
    abudhabi: { name: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lon: 54.3773, flag: '🇦🇪' },
    riyadh: { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, flag: '🇸🇦' },
    jeddah: { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.3891, lon: 39.8579, flag: '🇸🇦' },
    mecca: { name: 'Mecca', country: 'Saudi Arabia', lat: 21.3891, lon: 39.8579, flag: '🇸🇦' },
    medina: { name: 'Medina', country: 'Saudi Arabia', lat: 24.5247, lon: 39.5692, flag: '🇸🇦' },
    kuwait: { name: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lon: 47.9774, flag: '🇰🇼' },
    doha: { name: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310, flag: '🇶🇦' },
    muscat: { name: 'Muscat', country: 'Oman', lat: 23.5880, lon: 58.3829, flag: '🇴🇲' },
    manama: { name: 'Manama', country: 'Bahrain', lat: 26.2235, lon: 50.5876, flag: '🇧🇭' },
    tehran: { name: 'Tehran', country: 'Iran', lat: 35.6892, lon: 51.3890, flag: '🇮🇷' },
    // Asia
    beijing: { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, flag: '🇨🇳' },
    shanghai: { name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, flag: '🇨🇳' },
    tokyo: { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    seoul: { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, flag: '🇰🇷' },
    bangkok: { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, flag: '🇹🇭' },
    singapore: { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, flag: '🇸🇬' },
    kualalumpur: { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lon: 101.6869, flag: '🇲🇾' },
    jakarta: { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456, flag: '🇮🇩' },
    manila: { name: 'Manila', country: 'Philippines', lat: 14.5995, lon: 120.9842, flag: '🇵🇭' },
    dhaka: { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125, flag: '🇧🇩' },
    colombo: { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612, flag: '🇱🇰' },
    kathmandu: { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lon: 85.3240, flag: '🇳🇵' },
    kabul: { name: 'Kabul', country: 'Afghanistan', lat: 34.5553, lon: 69.2075, flag: '🇦🇫' },
    // Europe
    london: { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    paris: { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    berlin: { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, flag: '🇩🇪' },
    madrid: { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, flag: '🇪🇸' },
    rome: { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, flag: '🇮🇹' },
    amsterdam: { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, flag: '🇳🇱' },
    moscow: { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, flag: '🇷🇺' },
    istanbul: { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, flag: '🇹🇷' },
    // Americas
    newyork: { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
    losangeles: { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, flag: '🇺🇸' },
    chicago: { name: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, flag: '🇺🇸' },
    toronto: { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, flag: '🇨🇦' },
    saopaulo: { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, flag: '🇧🇷' },
    buenosaires: { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, flag: '🇦🇷' },
    // Africa
    cairo: { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, flag: '🇪🇬' },
    lagos: { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, flag: '🇳🇬' },
    nairobi: { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, flag: '🇰🇪' },
    johannesburg: { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473, flag: '🇿🇦' },
    // Oceania
    sydney: { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
    melbourne: { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, flag: '🇦🇺' },
};
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function findCity(input) {
    const key = input.toLowerCase().replace(/[\s\-_]/g, '');
    if (CITIES[key])
        return CITIES[key];
    // Fuzzy: find first city whose key includes input
    for (const [k, city] of Object.entries(CITIES)) {
        if (k.includes(key) || key.includes(k))
            return city;
        if (city.name.toLowerCase().replace(/\s/g, '').includes(key))
            return city;
    }
    return null;
}
function flightTime(km) {
    const hours = km / 900; // avg commercial flight speed
    if (hours < 1)
        return `~${Math.round(hours * 60)} min`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}
function drivingTime(km) {
    const hours = km / 80; // avg driving speed
    if (hours < 1)
        return `~${Math.round(hours * 60)} min`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}
export default {
    command: 'distance',
    aliases: ['dist', 'distancecalc', 'citydist'],
    category: 'utility',
    description: 'Calculate distance between two cities with flight and driving time estimates',
    usage: '.distance <city1> to <city2>\nExample: .distance lagos to dubai',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const input = args.join(' ').trim().toLowerCase();
        if (!input) {
            return await sock.sendMessage(chatId, {
                text: `🌍 *Distance Calculator*\n\n` +
                    `*Usage:* \`.distance <city1> to <city2>\`\n\n` +
                    `*Examples:*\n` +
                    `• \`.distance lagos to dubai\`\n` +
                    `• \`.distance lahore to islamabad\`\n` +
                    `• \`.distance london to newyork\`\n` +
                    `• \`.distance tokyo to singapore\`\n\n` +
                    `*Supported cities include:*\n` +
                    `🇵🇰 PK · 🇮🇳 IN · 🇦🇪 UAE · 🇸🇦 SA · 🇬🇧 UK\n` +
                    `🇺🇸 USA · 🇨🇳 CN · 🇯🇵 JP · 🇫🇷 FR · 🇩🇪 DE\n` +
                    `🇧🇩 BD · 🇦🇫 AF · 🇮🇷 IR · 🇹🇷 TR · + many more`,
                ...channelInfo
            }, { quoted: message });
        }
        const toIndex = args.findIndex((a) => a.toLowerCase() === 'to');
        if (toIndex === -1 || toIndex === 0 || toIndex === args.length - 1) {
            return await sock.sendMessage(chatId, {
                text: `❌ Use: \`.distance <city1> to <city2>\``,
                ...channelInfo
            }, { quoted: message });
        }
        const city1Input = args.slice(0, toIndex).join('').toLowerCase();
        const city2Input = args.slice(toIndex + 1).join('').toLowerCase();
        const city1 = findCity(city1Input);
        const city2 = findCity(city2Input);
        if (!city1) {
            return await sock.sendMessage(chatId, {
                text: `❌ City not found: *${args.slice(0, toIndex).join(' ')}*\n\nTry common city names like: karachi, dubai, london, newyork`,
                ...channelInfo
            }, { quoted: message });
        }
        if (!city2) {
            return await sock.sendMessage(chatId, {
                text: `❌ City not found: *${args.slice(toIndex + 1).join(' ')}*\n\nTry common city names like: nigeria, dubai, london, newyork`,
                ...channelInfo
            }, { quoted: message });
        }
        if (city1.name === city2.name) {
            return await sock.sendMessage(chatId, {
                text: `😄 Both cities are the same! Distance is 0 km.`,
                ...channelInfo
            }, { quoted: message });
        }
        const km = haversine(city1.lat, city1.lon, city2.lat, city2.lon);
        const miles = km * 0.621371;
        const nm = km * 0.539957;
        await sock.sendMessage(chatId, {
            text: `🌍 *Distance Calculator*\n\n` +
                `${city1.flag} *From:* ${city1.name}, ${city1.country}\n` +
                `${city2.flag} *To:* ${city2.name}, ${city2.country}\n\n` +
                `━━━━━━━━━━━━━━━━━\n` +
                `📏 *Distance:*\n` +
                `   • ${Math.round(km).toLocaleString()} km\n` +
                `   • ${Math.round(miles).toLocaleString()} miles\n` +
                `   • ${Math.round(nm).toLocaleString()} nautical miles\n\n` +
                `✈️ *Flight time:* ${flightTime(km)}\n` +
                `🚗 *Drive time:* ${drivingTime(km)}\n\n` +
                `📍 *Coordinates:*\n` +
                `   ${city1.name}: ${city1.lat.toFixed(4)}, ${city1.lon.toFixed(4)}\n` +
                `   ${city2.name}: ${city2.lat.toFixed(4)}, ${city2.lon.toFixed(4)}`,
            ...channelInfo
        }, { quoted: message });
    }
};
