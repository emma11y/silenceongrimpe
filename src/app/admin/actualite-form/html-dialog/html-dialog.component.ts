import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogResult } from '../footnote-dialog/footnote-dialog.component';
import { sanitizeHtmlFragment } from '@utilities/html.utility';

@Component({
  selector: 'app-html-dialog',
  imports: [FormsModule],
  templateUrl: './html-dialog.component.html',
  styleUrl: './html-dialog.component.scss',
})
export class HtmlDialogComponent implements OnInit {
  @Input() title: string = 'Inserer du HTML';
  @Input() initialValue: string = '';
  @Output() outputClose = new EventEmitter<DialogResult | undefined>();

  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  public content: string = '';

  get sanitizedPreviewHtml(): string {
    return sanitizeHtmlFragment(this.content);
  }

  get previewHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.sanitizedPreviewHtml);
  }

  ngOnInit(): void {
    this.content = this.initialValue;
  }

  public onSubmit(): void {
    const trimmedContent = this.content.trim();

    if (!trimmedContent) {
      return;
    }

    this.outputClose.emit({ content: trimmedContent });
  }

  public onCancel(): void {
    this.outputClose.emit(undefined);
  }
}
