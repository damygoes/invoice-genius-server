import {
  createKindeServerClient,
  GrantType,
  SessionManager,
} from '@kinde-oss/kinde-typescript-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

// Client for authorization code flow
const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

// Client for client credentials flow
const kindeApiClient = createKindeServerClient(GrantType.CLIENT_CREDENTIALS, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

let store: Record<string, unknown> = {};

const sessionManager: SessionManager = {
  async getSessionItem(key: string) {
    return store[key];
  },
  async setSessionItem(key: string, value: unknown) {
    store[key] = value;
  },
  async removeSessionItem(key: string) {
    delete store[key];
  },
  async destroySession() {
    store = {};
  },
};

export { kindeApiClient, kindeClient, sessionManager };
