import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { CharacterPresentationComponent } from './pages/character-presentation/character-presentation.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { MonsterPresentationComponent } from './pages/monster-presentation/monster-presentation.component';
import { MonsterCardComponent } from './components/monster-card/monster-card.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterCardComponent,
    CharacterPresentationComponent,
    SideBarComponent,
    MonsterPresentationComponent,
    MonsterCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
