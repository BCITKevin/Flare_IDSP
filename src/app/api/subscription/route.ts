import { NextResponse } from 'next/server';
import storeSubscription from './actions';

export async function POST(req: Request) {
    const { clientId, subscription } = await req.json();
    try {
        const res = await storeSubscription(clientId, subscription);
        
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

