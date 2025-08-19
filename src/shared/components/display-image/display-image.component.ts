import { Component, Input } from '@angular/core';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-display-image',
  imports: [],
  templateUrl: './display-image.component.html',
  styleUrl: './display-image.component.scss',
})
export class DisplayImageComponent {
  @Input() picture!: Picture;
}
