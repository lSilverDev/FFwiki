import { Component, Input } from '@angular/core';
import { Monsters } from 'src/app/interfaces/monsters';

@Component({
  selector: 'app-monster-card',
  templateUrl: './monster-card.component.html',
  styleUrls: ['./monster-card.component.css']
})
export class MonsterCardComponent {
  @Input() monster!: Monsters;
}
