import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from '../interfaces/characters';
import { Monsters } from '../interfaces/monsters';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  readonly API = "https://www.moogleapi.com/api/v1";

  constructor(private http: HttpClient) { }

  getCharacters(){
    return this.http.get<Character[]>(this.API + "/characters");
  }

  getMonsters(){
    return this.http.get<Monsters[]>(this.API + "/monsters");
  }
}
