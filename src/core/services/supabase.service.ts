import { Injectable } from '@angular/core';
import { ActualiteForm } from '@app/admin/actualite-form/actualite-form';
import { Evenement } from '@app/admin/evenement-form/evenement-form';
import { Picture } from '@shared/models/picture';
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

  createOrUpdateEvenement(evenement: Evenement) {
    if (evenement.id) {
      return this.supabase
        .from('evenements')
        .update(evenement)
        .eq('id', evenement.id);
    } else {
      return this.supabase.from('evenements').insert(evenement).select();
    }
  }

  deleteEvenement(id: number | undefined) {
    return this.supabase.from('evenements').delete().eq('id', id);
  }

  getEvenementForm(id: number): any {
    return this.supabase.from('evenements').select('*').eq('id', id);
  }

  getEvenements(): any {
    return this.supabase.from('evenements').select('*');
  }

  async getEvenementExists(
    titre: string,
    date: string,
    annee: string
  ): Promise<number | null> {
    const { data } = await this.supabase
      .from('evenements')
      .select('*')
      .eq('titre', titre)
      .eq('date', date)
      .eq('annee', annee);

    if (data?.length) {
      return data[0].id;
    }

    return null;
  }

  async addEvenements(evenements: Evenement[]) {
    return await this.supabase.from('evenements').insert(evenements);
  }

  async updateEvenements(evenements: Evenement[]) {
    const updates = evenements.map((evenement) =>
      this.supabase.from('evenements').update(evenement).eq('id', evenement.id)
    );
    return Promise.all(updates);
  }

  async createImage(picture: Picture) {
    return await this.supabase.from('images').insert(picture).select();
  }

  async getImages() {
    return await this.supabase.from('images').select('*');
  }

  async getImage(guid: string): Promise<Picture | null> {
    const result = await this.supabase
      .from('images')
      .select('*')
      .eq('id', guid);

    if (result.data && result.data.length > 0) {
      return result.data[0];
    }

    return null;
  }

  createOrUpdateActualite(actualite: ActualiteForm) {
    if (actualite.id) {
      return this.supabase
        .from('actualites')
        .update(actualite)
        .eq('id', actualite.id);
    } else {
      return this.supabase.from('actualites').insert(actualite);
    }
  }

  getActualite(slug: string): any {
    return this.supabase.from('actualites').select('*').eq('slug', slug);
  }

  getUrl(guid: string) {
    return `${this.supabaseUrl}/functions/v1/get-image?guid=${guid}`;
  }
}
