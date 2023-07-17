import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterPresentationComponent } from './pages/character-presentation/character-presentation.component';
import { MonsterPresentationComponent } from './pages/monster-presentation/monster-presentation.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'character',
    component: CharacterPresentationComponent
  },
  {
    path: 'monters',
    component: MonsterPresentationComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
