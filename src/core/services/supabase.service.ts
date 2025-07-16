import { Injectable } from '@angular/core';
import { createBrowserClient } from '@supabase/ssr';
import {
  AuthChangeEvent,
  AuthSession,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';

//https://supabase.com/docs/guides/getting-started/tutorials/with-angular

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  supabaseUrl: string = 'https://xougupyvckqdjqtkyqyr.supabase.co';
  supabaseKey: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdWd1cHl2Y2txZGpxdGt5cXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA5ODAsImV4cCI6MjA2ODI1Njk4MH0.PdDCh0qa-jgQr8D1fNUAszqI9ftngvnAZgucsDUREjw';

  constructor() {
    this.supabase = createBrowserClient(this.supabaseUrl, this.supabaseKey);
  }

  get session() {
    return this.supabase.auth.getSession().then(({ data }) => {
      return (this._session = data.session);
    });
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}
