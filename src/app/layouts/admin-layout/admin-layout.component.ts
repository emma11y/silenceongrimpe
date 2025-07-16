import { Component, inject, ViewChild } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { AlertService } from '@core/services/alert.service';
import { PopupComponent } from '@shared/components/popup/popup.component';
import { NgIf } from '@angular/common';
import { PopupService } from '@core/services/popup.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterOutlet, AlertComponent, PopupComponent, NgIf],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private superbase: SupabaseService = inject(SupabaseService);
  private router: Router = inject(Router);
  private alertService: AlertService = inject(AlertService);
  private popupService: PopupService = inject(PopupService);

  public user!: User;

  @ViewChild('alert', { static: true }) public alert:
    | AlertComponent
    | undefined;

  @ViewChild('popup', { static: true }) public popup:
    | PopupComponent
    | undefined;

  constructor() {
    this.superbase.session.then((session) => {
      if (session) {
        this.user = session.user;
      }
    });
  }

  ngOnInit(): void {
    if (this.alert) {
      this.alertService.setAlertComponent(this.alert);
    }

    if (this.popup) {
      this.popupService.setPopupComponent(this.popup);
    }
  }

  onLogOut() {
    this.superbase.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
