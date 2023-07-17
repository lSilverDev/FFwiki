import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/interfaces/characters';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-character-presentation',
  templateUrl: './character-presentation.component.html',
  styleUrls: ['./character-presentation.component.css']
})
export class CharacterPresentationComponent implements OnInit{
  showing: number = 6;
  moreCharacters: boolean = true;
  characters!: Character[];
  isLoading!: boolean;

  constructor(private service: CharactersService){}

  ngOnInit(): void {
    this.isLoading = true;

    this.service.getCharacters().subscribe((character) => {
      this.characters = character;
    })

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  showMore(){
    this.showing = this.showing + 6;

    if(this.showing >= this.characters.length){
      this.moreCharacters = false;
    }
  }
}
