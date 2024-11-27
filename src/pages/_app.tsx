import { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch((err) => console.error('Service Worker registration failed', err));
        }
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;