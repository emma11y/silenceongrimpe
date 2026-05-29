import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogResult } from '../footnote-dialog/footnote-dialog.component';
import { VideoItem } from '@shared/models/video-item';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { FormsModule, NgForm } from '@angular/forms';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-video-dialog',
  imports: [ValidationSummaryComponent, FormsModule],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
})
export class VideoDialogComponent implements OnInit {
  @Input() initialValue?: VideoItem;
  @Output() outputClose = new EventEmitter<DialogResult | undefined>();

  form: VideoItem = {
    src: '',
    thumbnail: '',
    transcription: '',
  };

  isUpdate: boolean = false;

  ngOnInit(): void {
    if (this.initialValue) {
      this.form = this.initialValue;
      this.isUpdate = true;
    }
  }

  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    this.outputClose.emit({ content: form.value });
  }

  public onCancel(): void {
    this.outputClose.emit(undefined);
  }
}
