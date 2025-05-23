import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-round',
  imports: [],
  templateUrl: './button-round.component.html',
  styleUrl: './button-round.component.css'
})
export class ButtonRoundComponent {
    @Input() image: string = '';
    @Output("submit") onSumit = new EventEmitter();

    submit() {
        this.onSumit.emit();
    }
}
