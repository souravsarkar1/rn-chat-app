export const formatTime = (time: string | Date) => {
    const date = new Date(time);

    // Format to readable time string (e.g., "3:50 PM" or "Feb 1, 3:50 PM")
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    if (isToday) {
        return date.toLocaleTimeString('en-US', timeOptions);
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...timeOptions
    });
}

