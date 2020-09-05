export const setToLocalStorage = <T>(key: string, data: T) => {
    window.localStorage.setItem(key, JSON.stringify(data));
}
export const getFromLocalStorage = <T>(key: string): T => {
    return JSON.parse(window.localStorage.getItem(key) || '{}');
}