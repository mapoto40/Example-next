/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.discordapp.com' },
            { protocol: 'https', hostname: 'imagedelivery.net' },
            { protocol: 'https', hostname: 'prochedemoi.fr' },
            { protocol: 'https', hostname: 'i.gifer.com' },
            { protocol: 'http', hostname: 'localhost' },
        ],
        dangerouslyAllowSVG: true,
    },
};

module.exports = nextConfig
