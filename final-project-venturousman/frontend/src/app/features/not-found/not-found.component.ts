import {Component, input} from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: 'not-found.component.html',
  styleUrl:'not-found.component.css'
})
export class NotFoundComponent {
  message = input('')
}
