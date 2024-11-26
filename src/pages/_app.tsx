import { useEffect } from 'react';

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => console.log('Service Worker registered'))
                .catch((err) => console.error('Service Worker registration failed', err));
        }
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;