import CryptoJS from 'crypto-js';

/**
 * Function that generates a SHA-256 hash from the provided key.
 * @param {string} key - The key to hash.
 * @returns - The resulting hash in hexadecimal format.
 */
function hashKey(key: string) {
    const hash = CryptoJS.SHA256(key);
    return hash.toString(CryptoJS.enc.Hex);
}

/**
 * Function that encrypts the provided data using the AES algorithm.
 * @param {any} data - The data to encrypt.
 * @returns {string} - The encrypted data in string format.
 * @throws {Error} - An error is thrown if the key is missing.
 */
function encryptAES(data: any): string {
    if (process.env.NEXT_PUBLIC_SESSION_KEY) {
        const key = CryptoJS.enc.Hex.parse(hashKey(process.env.NEXT_PUBLIC_SESSION_KEY));
        const iv = CryptoJS.enc.Hex.parse('0'.repeat(32));

        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv: iv }).toString();

        return ciphertext;
    } else {
        throw new Error("Missing key");
    }
}

/**
 * Function that decrypts data encrypted with the AES algorithm.
 * @param {string} ciphertext - The encrypted data to decrypt.
 * @returns {any} - The decrypted data.
 * @throws {Error} - An error is thrown if the key is missing.
 */
function decryptAES(ciphertext: string): any {
    if (process.env.NEXT_PUBLIC_SESSION_KEY) {
        const key = CryptoJS.enc.Hex.parse(hashKey(process.env.NEXT_PUBLIC_SESSION_KEY));
        const iv = CryptoJS.enc.Hex.parse('0'.repeat(32));

        const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return decryptedData;
    } else {
        throw new Error("Missing key");
    }
}

const session = {
    /**
     * Function to store data in sessionStorage
     * @param {string} name - the session key 
     * @param {any} value - the value associated with the key
     */
    set(name: string, value: any) {
        if(process.env.NEXT_PUBLIC_NODE_ENV === "production"){
            const AES_name = encryptAES(name);
            const AES_value = encryptAES(JSON.stringify(value))

            sessionStorage.setItem(AES_name, AES_value)
        } else {
            sessionStorage.setItem(name, JSON.stringify(value))
        }
    },


    /**
     * Function that retrieves the value associated with a key stored in the session, using AES decryption in production.
     * @param {string} name - The name of the key.
     * @returns {any} - The value associated with the key.
     */
    get(name: string): any {
        if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
            const AES_name = encryptAES(name);

            let data = sessionStorage.getItem(AES_name);
            if (data && data !== null) return decryptAES(data);
        } else {
            let data = sessionStorage.getItem(name);
            if (data && data !== null) return data;
        }

        return undefined;
    },

    /**
     * Function that removes a specific key or clears all session data.
     * @param {string} [name] - The name of the key to remove
     */
    remove(name?: string){
        if (name) sessionStorage.removeItem(
            process.env.NEXT_PUBLIC_NODE_ENV === "production" ?
                encryptAES(name) : name );
        else sessionStorage.clear()
    }
}

export default session;