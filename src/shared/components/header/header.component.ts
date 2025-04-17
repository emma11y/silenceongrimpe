import { Component } from '@angular/core';
import { RouterLinkActiveDirective } from '@shared/directives/router-link-active.directive';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActiveDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
