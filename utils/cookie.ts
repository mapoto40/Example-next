import { GetServerSidePropsContext, PreviewData } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

/**
 * Sets a cookie with the specified name, value, expiration, and optional path.
 * 
 * @param options - The options for setting the cookie.
 * @param options.name - The name of the cookie.
 * @param options.value - The value to be stored in the cookie.
 * @param options.expiresIn - The expiration date or time in seconds.
 * @param options.path - The optional path for the cookie.
 */
export function setCookie({ name, value, expiresIn, path = "/" }: {
    name: string;
    value: string;
    expiresIn?: Date | number;
    path?: string;
}) {
    let cookie = `${name}=${value};`;

    if (expiresIn instanceof Date) {
        cookie += `expires=${expiresIn.toUTCString()};`;
    } else if (typeof expiresIn === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + expiresIn * 1000);

        cookie += `expires=${date.toUTCString()};`;
    }

    document.cookie = `${cookie}path=${path};`;
}

/**
 * Retrieves the value of a cookie with the specified name.
 * 
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie or null if not found.
 */
export function getCookie(
    name: string,
    ctx?: GetServerSidePropsContext<NextParsedUrlQuery, PreviewData>
): string | null {
    name += "=";

    try {
        let cookies: string[] | null = null;

        // set cookies based on the environment
        if (ctx) cookies = decodeURIComponent(ctx.req.headers?.cookie || '').split(';');

        if (typeof document !== 'undefined')
            cookies = decodeURIComponent(document.cookie).split(';');

        if (!cookies) return null;

        // find the cookie with the specified name
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();

            if (cookie.startsWith(name)) {
                return cookie.substring(name.length, cookie.length);
            }
        }
    } catch (_) {}

    return null;
}

/**
 * Deletes a cookie with the specified name.
 * 
 * @param name - The name of the cookie to delete.
 */
export const deleteCookie = (name: string) => setCookie({
    name, value: '', expiresIn: new Date(0)
});

/** Object containing utility functions to deal with cookies. */
export default { set: setCookie, get: getCookie, remove: deleteCookie };
