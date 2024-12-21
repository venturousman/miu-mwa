import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
        RouterOutlet,
        FooterComponent,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MarkdownModule,
    ],
    templateUrl: 'app.component.html',
    styles: [],
    standalone: true,
})
export class AppComponent {
}
