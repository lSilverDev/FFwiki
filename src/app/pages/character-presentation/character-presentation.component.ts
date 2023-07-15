import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/interfaces/character';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-character-presentation',
  templateUrl: './character-presentation.component.html',
  styleUrls: ['./character-presentation.component.css']
})
export class CharacterPresentationComponent implements OnInit{

  characters!: Character[];

  constructor(private service: CharactersService){}

  ngOnInit(): void {
    this.service.getCharacters().subscribe((character) => {
      this.characters = character;
    })
  }
}
