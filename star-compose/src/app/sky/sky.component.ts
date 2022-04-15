import { ConstantPool } from '@angular/compiler';
import { 
  Component, 
  OnInit, 
  Attribute, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChildren, 
  QueryList,
  ElementRef
} from '@angular/core';
import { ConstellationComponent } from '../constellation/constellation.component';
// import { EventEmitter } from 'stream';
import { Connection } from '../_models/connection.model';
import { Constellation } from '../_models/constellation.model';
import { Star } from '../_models/star.model';
import {SynthService} from '../_services/tone.service';
import data from './constellations.json'; 

@Component({
  selector: 'app-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.css'],
})
export class SkyComponent implements OnInit {

  @ViewChildren(ConstellationComponent) consts!: QueryList<ConstellationComponent>;
  @Output() getScreenCoords = new EventEmitter<boolean>();

  constructor(private synth: SynthService) { }

  constellations:Constellation[] = [];
  activeConstellatoions: Constellation[] = [];
  playTime = 120;

  renderAudio($event: boolean) {
    let constData: {stars: Star[], connections: Connection[]} = {stars: [], connections: []}
    // console.log("sky got button press");
    // this.consts.forEach((element, index) => console.log(element.getScreenCoord()));
    this.consts.forEach((element, index) => {
      // console.log(element.getScreenCoord().stars);
      constData.stars.push(...element.getScreenCoord().stars);
      constData.connections.push(...element.getScreenCoord().connections);
    });
    console.log(constData);
    
    this.synth.playStars(constData, this.playTime);
  }

  add(cname: string) {
    let c = this.constellations.find(elem => elem.name === cname)
    if (c) {this.activeConstellatoions.push(c)}
  }

  ngOnInit(): void {
    for (let i = 0 ; i < data.constellations.length ; i++) {
      let conste: any = data.constellations[i]
      let stars: Star[] = []
      let connections: Connection[] = []
      for (let j = 0 ; j < conste.stars.length ; j++) {
        stars.push(new Star(conste.stars[j][0], conste.stars[j][1]) )
      }
      for (let j = 0 ; j < conste.connections.length ; j++) {
        connections.push(new Connection(conste.connections[j][0], conste.connections[j][1], conste.connections[j][2], conste.connections[j][3]));
      }
      conste.stars = stars;
      conste.connections = connections;
      this.constellations.push(conste);
    }
  }

}