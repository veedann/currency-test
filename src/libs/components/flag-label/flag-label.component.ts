import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'flag-label',
  templateUrl: './flag-label.component.html',
  styleUrl: './flag-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FlagLabelComponent {
  @Input() code!: string;
}
