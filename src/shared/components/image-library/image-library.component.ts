import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-image-library',
  imports: [],
  templateUrl: './image-library.component.html',
  styleUrl: './image-library.component.scss',
})
export class ImageLibraryComponent {
  @Input() images: Picture[] = [];
  @Output() outputDisplayPicture: EventEmitter<Picture> =
    new EventEmitter<Picture>();

  public onDisplayImageClick(picture: Picture): void {
    this.outputDisplayPicture.emit(picture);
  }
}
