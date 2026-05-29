import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DialogResult {
  content: string | any;
}

@Component({
  selector: 'app-footnote-dialog',
  imports: [FormsModule],
  templateUrl: './footnote-dialog.component.html',
  styleUrl: './footnote-dialog.component.scss',
})
export class FootnoteDialogComponent implements OnInit {
  @Input() title: string = 'Ajouter une note de bas de page';
  @Input() initialValue: string = '';
  @Output() outputClose = new EventEmitter<DialogResult | undefined>();

  public content: string = '';

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
