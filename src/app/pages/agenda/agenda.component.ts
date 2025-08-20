import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaItem } from '../home/agenda-carrousel/agenda-item';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-agenda',
  imports: [NgIf],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  items: AgendaItem[] = [];

  constructor() {
    this.items = this.route.snapshot.data['items'];
  }
}
