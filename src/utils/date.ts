// ============================================
// DATE UTILITIES
// ============================================

// Get today's date in ISO format (Asia/Kathmandu)
export function getTodayISO(): string {
    const now = new Date();
    // Nepal is UTC+5:45
    const nepalOffset = 5 * 60 + 45;
    const utcOffset = now.getTimezoneOffset();
    const nepalTime = new Date(now.getTime() + (nepalOffset + utcOffset) * 60000);
    return nepalTime.toISOString().split('T')[0];
}

// Format date for display
export function formatDate(dateISO: string): string {
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });
}

// Get relative day label
export function getRelativeDay(dateISO: string): string {
    const today = getTodayISO();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    if (dateISO === today) return 'Today';
    if (dateISO === yesterdayISO) return 'Yesterday';
    return formatDate(dateISO);
}

// Get current time in Nepal
export function getNepalTime(): Date {
    const now = new Date();
    const nepalOffset = 5 * 60 + 45;
    const utcOffset = now.getTimezoneOffset();
    return new Date(now.getTime() + (nepalOffset + utcOffset) * 60000);
}
