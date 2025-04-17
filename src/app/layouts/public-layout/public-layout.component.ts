import { Component } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { TitlePageDirective } from '@shared/directives/title-page.directive';

@Component({
  selector: 'app-public-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, TitlePageDirective],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {}
