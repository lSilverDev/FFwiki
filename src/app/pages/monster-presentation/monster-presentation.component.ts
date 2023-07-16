import { Component } from '@angular/core';
import { Monsters } from 'src/app/interfaces/monsters';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-monster-presentation',
  templateUrl: './monster-presentation.component.html',
  styleUrls: ['./monster-presentation.component.css']
})
export class MonsterPresentationComponent {
    showing: number = 6;
    moreMonsters: boolean = true;
    monsters!: Monsters[];

    constructor(private service: CharactersService){}

    ngOnInit(): void {
      this.service.getMonsters().subscribe((monster) => {
        this.monsters = monster;
      })
    }

    showMore(){
      this.showing = this.showing + 6;

      if(this.showing >= this.monsters.length){
        this.moreMonsters = false;
      }
    }
}
