import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Explore Marrakech like local',
        short_name: 'Explore Marrakesh',
        description: 'Uncover the Secrets of Marrakech with trusted local guides. Authentic experiences, hand-picked tours, and unforgettable adventures.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#E16A28',
        icons: [
            {
                src: '/icon',
                sizes: '32x32',
                type: 'image/png',
            },
        ],
        categories: ['travel', 'tourism', 'lifestyle'],
        lang: 'en-US',
        orientation: 'portrait',
    };
}
