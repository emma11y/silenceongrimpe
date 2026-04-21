import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FragmentService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewportScroller: ViewportScroller =
    inject(ViewportScroller);

  public initFragments(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const fragments = this.document.querySelectorAll(
      '.fragment, .note, .footnote-backlink',
    );

    if (fragments.length > 0) {
      Array.from(fragments).forEach((fragment: any) => {
        fragment.addEventListener('click', (e: Event) => {
          e.preventDefault();

          const fragmentTo = fragment.href.split('#').pop();
          if (fragmentTo) {
            this.viewportScroller.scrollToAnchor(fragmentTo);
          }
        });
      });
    }
  }
}
