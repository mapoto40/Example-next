/**
 * Checks if the given object has the specified property.
 * @param {any} obj - The object to check.
 * @param {string} prop - The property to check for.
 * @returns {boolean} - `true` if the object has the property, `false` otherwise.
 */
const hasProp = (obj: any, prop: string) => Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Converts data into base64-encoded data.
 * @param {string} data - The data to be encoded.
 * @returns {string} - The base64-encoded data.
 */
export const base64encode = (data: string) => {
    if (hasProp(globalThis, 'Buffer')) {
        return Buffer.from(data).toString('base64');
    } else if (hasProp(globalThis, 'btoa')) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);
        // @ts-ignore
        return btoa(String.fromCharCode.apply(null, encoded));
    } else {
        return data;
    }
};

/**
 * Converts base64-encoded data into utf-8 data.
 * @param {string} data - The base64-encoded data to be decoded.
 * @returns {string} - The utf-8 decoded data.
 */
export const base64decode = (data: string) => {
    if (hasProp(globalThis, 'Buffer')) {
        return Buffer.from(data, 'base64').toString();
    } else if (hasProp(globalThis, 'atob')) {
        const decoder = new TextDecoder();
        const decoded = atob(data);
        // @ts-ignore
        return decoder.decode(new Uint8Array([...decoded].map(c => c.charCodeAt(0))));
    } else {
        return data;
    }
};