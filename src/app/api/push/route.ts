import admin, { FirebaseError } from 'firebase-admin';
import { NextResponse } from 'next/server';
import deleteToken from './actions';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export async function POST(req: Request) {
  const { token, title, body, url } = await req.json();

  if (!token || !title || !body) {
    return NextResponse.json(
      { success: false, status: 400, error: "Missing required fields: token, title, or body" },
      { status: 400 }
    );
  }

  const message: admin.messaging.Message = {
    token,
    data: {
      title: title,
      body: body,
      icon: "/images/logo_Flare.png",
      click_action: url || "/homepage",
    },
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return NextResponse.json({ success: true, status: 200, response });
  } catch (error) {
    if ((error as FirebaseError).code === "messaging/registration-token-not-registered") {
      console.log("Invalid FCM token. Deleting from server.");
      // 클라이언트 토큰 삭제 로직 추가
      // await deleteToken(clientId, token);
    } else {
      console.error("Error sending notification:", error);
    }
    return NextResponse.json(
      { success: false, status: 500, error: error || "Unknown error" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  const { clientId, token } = await req.json();

  try {
    const res = await deleteToken(clientId, token);

    if (res.success) {
      return NextResponse.json({ success: true, status: 200 });
    } else {
      return NextResponse.json({ success: false, status: 500 });
    }

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ success: false, status: 500, error: error })
  }
}