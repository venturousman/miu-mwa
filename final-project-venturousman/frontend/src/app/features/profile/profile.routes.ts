import {Routes} from '@angular/router';
import {SharedLinksComponent} from './shared-links/shared-links.component';
import {ArchivedComponent} from './archived/archived.component';
import {InfoComponent} from './info/info.component';

export const profile_routes: Routes = [
  {path: "", component: InfoComponent},
  {path: "archived", component: ArchivedComponent},
  {path: "shared-links", component: SharedLinksComponent},
]
