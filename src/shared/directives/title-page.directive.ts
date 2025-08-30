import { DOCUMENT } from '@angular/common';
import { Directive, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Directive({
  selector: '[titlePageA11y]',
  standalone: true,
})
export class TitlePageAccessibilityDirective {
  constructor(
    protected _router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // for accessibility - https://access42.net/accessibilite-rechargement-page-single-page-applications
        const element: HTMLElement | null =
          this.document.getElementById('title-page');
        if (element) {
          element.innerHTML = this.document.title;
        }
      }
    });
  }
}
