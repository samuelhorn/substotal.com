import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Substotal - Subscription Tracker',
        short_name: 'substotal',
        description: 'A simple app to track your recurring subscriptions',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#1e1812',
        theme_color: '#F7EBAF',
        orientation: 'portrait',
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
    }
}