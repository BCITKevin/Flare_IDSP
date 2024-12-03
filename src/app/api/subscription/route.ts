import { NextResponse } from 'next/server';
import storeSubscription from './actions';

export async function POST(req: Request) {
    const { clientId, subscription } = await req.json();

    // if (typeof subscription === 'string') {
    // }
    const formatSubs = subscription.replace(/^"|"$/g, '');

    try {
        const res = await storeSubscription(clientId, formatSubs);

        if (res.message) {
            return NextResponse.json(
                { status: 200 }
            )
        }
        
        if (!res.success) {
            throw new Error('Failed to fetch subscription');
        } else {
            return NextResponse.json(
                { status: 200 }
            )
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
        );
    }
}

