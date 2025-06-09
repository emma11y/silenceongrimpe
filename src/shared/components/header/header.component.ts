import { Component } from '@angular/core';
import { NgClass } from '@node_modules/@angular/common';
import { RouterLinkActiveDirective } from '@shared/directives/router-link-active.directive';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActiveDirective, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showMenuMobile = false;
}
