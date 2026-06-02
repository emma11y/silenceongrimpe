import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopupComponentService } from '@core/services/popup-component.service';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { createFootnoteToken } from '@shared/utilities/footnote.utility';
import {
  DialogResult,
  FootnoteDialogComponent,
} from '../footnote-dialog/footnote-dialog.component';
import { VideoItem } from '@shared/models/video-item';
import { createVideoToken } from '@shared/utilities/video.utility';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { HtmlDialogComponent } from '../html-dialog/html-dialog.component';
import { prepareHtmlForEditor } from '@utilities/html.utility';

@Component({
  selector: 'app-actualite-editor',
  imports: [FormsModule, NgxEditorModule],
  templateUrl: './actualite-editor.component.html',
  styleUrl: './actualite-editor.component.scss',
})
export class ActualiteEditorComponent implements OnChanges, OnDestroy {
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  private readonly popup: PopupComponentService = inject(PopupComponentService);

  editorContent: string = '';
  editor: Editor = new Editor({
    history: true,
    keyboardShortcuts: true,
    plugins: [],
  });

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['undo', 'redo'],
  ];

  ngOnChanges(): void {
    if (this.content !== this.editorContent) {
      this.editorContent = this.content ?? '';
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onContentChange(value: string): void {
    this.editorContent = value ?? '';
    this.contentChange.emit(this.editorContent);
  }

  async onAddFootnote(): Promise<void> {
    const result = await this.openFootnoteDialog();

    if (!result?.content || !this.editor.view) {
      return;
    }

    const token = createFootnoteToken(result.content);
    const { state, dispatch } = this.editor.view;
    const insertPosition = state.selection.to;
    const transaction = state.tr.insertText(
      token,
      insertPosition,
      insertPosition,
    );

    dispatch(transaction);
    this.emitCurrentContent();
    this.editor.view.focus();
  }

  private emitCurrentContent(): void {
    this.editorContent = this.editor.view?.dom.innerHTML ?? this.editorContent;
    this.contentChange.emit(this.editorContent);
  }

  private async openFootnoteDialog(
    initialValue: string = '',
    title: string = 'Ajouter une note de bas de page',
  ): Promise<DialogResult | undefined> {
    const promise = this.popup.open(FootnoteDialogComponent, {
      initialValue,
      title,
    });

    this.popup.componentRef?.instance.outputClose.subscribe(
      (result: DialogResult | undefined) => {
        this.popup.close(result);
      },
    );

    return promise;
  }

  private async openVideoDialog(): Promise<DialogResult | undefined> {
    const promise = this.popup.open(VideoDialogComponent);

    this.popup.componentRef?.instance.outputClose.subscribe(
      (result: DialogResult | undefined) => {
        this.popup.close(result);
      },
    );

    return promise;
  }

  async onAddVideo(): Promise<void> {
    const result = await this.openVideoDialog();

    if (!result?.content || !this.editor.view) {
      return;
    }

    const video: VideoItem = result.content as VideoItem;
    const token = createVideoToken(video);
    const { state, dispatch } = this.editor.view;
    const insertPosition = state.selection.to;
    const transaction = state.tr.insertText(
      token,
      insertPosition,
      insertPosition,
    );

    dispatch(transaction);
    this.emitCurrentContent();
    this.editor.view.focus();
  }

  async onAddHtml(): Promise<void> {
    const result = await this.openHtmlDialog();
    const sanitizedHtml = prepareHtmlForEditor(result?.content ?? '');

    if (!sanitizedHtml || !this.editor.view) {
      return;
    }

    this.editor.commands.focus().insertHTML(sanitizedHtml).exec();
    this.emitCurrentContent();
    this.editor.view.focus();
  }

  private async openHtmlDialog(): Promise<DialogResult | undefined> {
    const promise = this.popup.open(HtmlDialogComponent);

    this.popup.componentRef?.instance.outputClose.subscribe(
      (result: DialogResult | undefined) => {
        this.popup.close(result);
      },
    );

    return promise;
  }
}
