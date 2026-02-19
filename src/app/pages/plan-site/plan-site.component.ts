import { orderBy } from 'lodash-es';
import { Component, inject, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-plan-site',
  imports: [CommonModule, RouterLink],
  templateUrl: './plan-site.component.html',
  styleUrl: './plan-site.component.scss',
})
export class PlanSiteComponent implements OnInit {
  menuItems: MenuItem[] = [];

  private readonly supabaseService: SupabaseService = inject(SupabaseService);

  constructor() {}

  ngOnInit(): void {
    this.generateSiteMap();
  }

  private async generateSiteMap(): Promise<void> {
    this.menuItems = [
      {
        path: '/',
        label: 'Accueil',
        children: [],
      },
      {
        path: '/collectif',
        label: 'Le collectif',
        children: [],
      },
      {
        path: '/agenda',
        label: 'Agenda',
        children: [],
      },
      {
        path: '/actualites',
        label: 'Actualités',
        children: await this.getActualites(),
      },
      {
        path: '/videos',
        label: 'Nos vidéos',
        children: [],
      },
      {
        path: '/contact',
        label: 'Nous contacter',
        children: [],
      },
      {
        path: '/mentions-legales',
        label: 'Mentions légales',
        children: [],
      },
      {
        path: '/plan-du-site',
        label: 'Plan du site',
        children: [],
      },
    ];
  }

  private async getActualites(): Promise<MenuItem[]> {
    const actualites = await this.supabaseService.getActualitesPubliees();
    if (actualites.data) {
      return orderBy(actualites.data, (x) => x.datePublication).map((item) => {
        return {
          path: `/actualites/${item.slug}`,
          label: item.titre,
        } as MenuItem;
      });
    }

    return [];
  }
}
