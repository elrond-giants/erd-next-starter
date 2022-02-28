const STORAGE_KEY = 'erdg.';
export const setItem = (key: string, value: { [key: string]: string | number | boolean | null}) => {
    localStorage.setItem(STORAGE_KEY + key, JSON.stringify(value));
};
export const getItem = (key: string) => {
    if (typeof window === 'undefined') {
        return;
    }
    const item = window.localStorage.getItem(STORAGE_KEY + key);
    if (item !== null) {
        return JSON.parse(item);
    }

    return item;
}
