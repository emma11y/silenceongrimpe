import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { TitlePageAccessibilityDirective } from '@shared/directives/title-page.directive';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-public-layout',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    TitlePageAccessibilityDirective,
    AlertComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements OnInit {
  private alertService: AlertService = inject(AlertService);

  @ViewChild('alert', { static: true }) public alert:
    | AlertComponent
    | undefined;

  ngOnInit(): void {
    if (this.alert) {
      this.alertService.setAlertComponent(this.alert);
    }
  }
}
