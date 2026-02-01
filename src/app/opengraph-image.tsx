import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Explore Marrakech like local - Authentic Moroccan Experiences';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 64,
                    background: 'linear-gradient(135deg, #E16A28 0%, #C54917 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        marginBottom: '40px',
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 'bold',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Explore Marrakech
                    </div>
                </div>
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 'normal',
                        opacity: 0.95,
                        textAlign: 'center',
                        maxWidth: '900px',
                    }}
                >
                    Uncover the Secrets of Marrakech with trusted local guides
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
