export const elapsedTime = (date: number): string => {
    const start = new Date(date);
    const end = new Date();
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return 'Now';
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)} Minutes ago`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)} Hours ago`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)} days ago`;

    return `${start.toLocaleDateString()}`;
};

export default elapsedTime;