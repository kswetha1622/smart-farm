import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp: App | null = null;

const initFirebase = (): void => {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[Firebase] Missing credentials. Auth middleware will reject all tokens in production.');
    firebaseApp = initializeApp({ projectId: projectId || 'demo-project' });
    return;
  }

  firebaseApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  console.log('[Firebase] Initialized successfully');
};

export { firebaseApp, initFirebase, getAuth };
