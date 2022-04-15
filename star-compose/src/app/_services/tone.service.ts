import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import * as Tone from 'tone';
import { PolySynth } from 'tone';
import { Monophonic } from 'tone/build/esm/instrument/Monophonic';
import { Connection } from '../_models/connection.model';
import { Constellation } from '../_models/constellation.model';
import { Star } from '../_models/star.model';

@Injectable({
    providedIn: 'root'
  })
export class SynthService {
  bpm: number;
  screenWidth: number;
  bassMajorCollection = ['C2', 'F2', 'G2', 'A3', 'C3']; //only typical tonal centers
  melodyMajorCollection = ['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'C5']; //removed the 7th for tonality
  bassMinorrCollection = ['A2', 'D2', 'E2', 'F2', 'A3']; //only typical tonal centers
  melodyMinorCollection = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'A5'];
  // bass synth for lines
  bass = new Tone.PolySynth(Tone.Synth, { 
  oscillator : {
    type : "sawtooth"
  }
  }).toDestination();

  
  constructor() {
    // Griffin PC: 6000
    // Grifin Loaner Laptop: 3900
    this.bpm = 0
    this.screenWidth = window.innerWidth;
    
  }
  //Reference for snippet -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
  getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

// build the melody based on the star data (currently just x data)
  playStars(constellation: {stars:Star[], connections:Connection[]}, playtime: number):void {
      this.setTempo(playtime, this.screenWidth, 50);
      Tone.Transport.bpm.value = this.bpm;
      // This assumes a constellation object with valid grid data.
      let synth = new Tone.Synth({
        oscillator : {
          volume: 5,
          count: 3,
          spread: 40,
          type : "fatsawtooth"
        }
      }).toDestination();
      console.log("playing star:", constellation);
      let stars = constellation.stars;
      let playData = [];
      // This builds play times based on the star dat of the constellation
      for (let star of stars) {
          let pTime = Math.floor(star.getX()/4);
          let pBeat = star.getX() % 4;
          playData.push({'time': pTime + ':' + pBeat, note: this.melodyMajorCollection[this.getRandomInt(0, 8)], duration: '16n', 'velocity': 0.9});
      }
      const melody = new Tone.Part(((time: any, value: { note: any; velocity: any; }) => {
        // the value is an object which contains both the note and the velocity
        synth.triggerAttackRelease(value.note, "16n", time, value.velocity);
      }), playData).start(0);
      let connections = constellation.connections;
      let playData2 = [];
      // This builds play times based on the line connections
      for (let line of connections) {
          let duration = Math.ceil((line.x2 - line.x1)/4);
          let pTime1 = Math.floor(line.x1/4);
          let pBeat1 = line.x1 % 4;
          playData2.push({'time': pTime1 + ':' + pBeat1, 'note': this.bassMajorCollection[this.getRandomInt(0, 5)], 'duration': duration +'m', 'velocity': 0.7});
      }
    const bassLine = new Tone.Part(((time: any, value: { note: any; velocity: any; duration: any; }) => {
      // the value is an object which contains both the note and the velocity
      this.bass.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      }), playData2).start(0);

    Tone.Transport.start();
  }
  // function for changing tempo
  setTempo(time:number, screenSize: number, divsionSize: number):void {
      this.bpm = (screenSize) * (60/time)
  }

  public testTone() {
      const synth = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
      synth.triggerAttackRelease("C4", "8n");
  }

}