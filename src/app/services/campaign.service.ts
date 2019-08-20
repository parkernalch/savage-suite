import { Injectable } from '@angular/core';
import data from '../data/campaigns.json';
import _Campaign from '../models/Campaign.js';
import _ChatMessage from "../models/ChatMessage";
import SavageCharacter, { _SavageCharacter } from '../models/Character.js';
import _Race from "../models/Race";
import _Edge from "../models/Edge";
import _Power, { _PowerInstance } from "../models/Power";
import { Observable, of } from 'rxjs';
import _Hindrance from '../models/Hindrance.js';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  campaigns: _Campaign[] = [];

  constructor() {
    data.forEach(campaign => {
      // console.log(campaign);
      var C: _Campaign = {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        motd: campaign.motd,
        chat: [],
        chronicle: [],
        party: [],
        sessions: [],
        next_session: new Date(2000,0,1,19,0,0)
      };
      // console.log(C.next_session);
      // C.id = campaign.id;
      // C.motd = campaign.motd;
      // C.chat = [];

      // Add Chat log 
      campaign.chat.forEach(msg => {
        let userTest = campaign.party.filter(member => member.id === msg.user);
        // console.log(campaign.party);
        let user:string = campaign.party.filter(member => member.id === msg.user)[0].name;

        let splitDate = msg.date.split('-');
        let date:Date = new Date(parseInt(splitDate[0]),parseInt(splitDate[1])-1,parseInt(splitDate[2]));
        let M: _ChatMessage = {
          user: user,
          message: msg.message,
          date: date,
          tags: msg.tags 
        };

        C.chat.push(M);
      });

      // C.chronicle = [];
      // Add Chronicle

      // C.name = campaign.name;
      // C.party = [];
      // Add Party
      campaign.party.forEach(char => {
        let race: _Race = {
          id: char.race.id,
          name: char.race.name,
          description: char.race.description,
          features: char.race.features,
          base_stats: {
            agility: 4,
            smarts: 4,
            strength: 4,
            spirit: 4,
            vigor: 4
          }
        }

        let CH: SavageCharacter = new SavageCharacter(char.id, char.name, race, char.rank);

        CH.traits = {
          attributes: char.traits.attributes,
          skills: char.traits.skills
        }
        CH.traits.skills.forEach(skill => skill.modifier = 0);

        if(char.description){
          CH.description = char.description;
        }

        if(char.class){
          CH.class = char.class;
        }

        if(char.edges){ 
          char.edges.forEach((edge) => {
            let _E: _Edge = {
              id: edge.id,
              name: edge.name,
              type: edge.type,
              description: edge.description,
              prerequisites: edge.prerequisites,
              effect: edge.effect
            }
            CH.edges.push(_E);
          });
        }

        if(char.powers){
          char.powers.forEach(power => {
            let _P: _Power = {
              id: null,
              name: power.power.name,
              ruletext: power.power.ruletext,
              rank: power.power.rank
            };
            let _PI: _PowerInstance = {
              id: null,
              name: power.name,
              trapping: power.trapping,
              cost: power.cost,
              effect: power.effect,
              range: power.range,
              sustain: power.sustain,
              duration: power.duration,
              power: _P
            };
            // power.varieties.forEach(v => {
            //   let _V: _PowerInstance = {
            //     name: v.name,
            //     cost: v.cost,
            //     effect: v.effect
            //   }
            //   _P.varieties.push(_V);
            // });
            CH.powers.push(_PI);
          });
        }

        if(char.hindrances){
          char.hindrances.forEach(hindrance => {
            let _H: _Hindrance = {
              id: hindrance.id,
              name: hindrance.name,
              description: hindrance.description,
              major: hindrance.major
            };

            CH.hindrances.push(_H);
          });
        }

        // console.log(CH);
        C.party.push(CH);
      });

      C.sessions = [];
      // Add Sessions
      let sessions:Date[] = campaign.sessions.map((session) => {
        // console.log(session);
        let year: number = parseInt(session.split('-')[0]);
        let month: number = parseInt(session.split('-')[1]) - 1;
        let day: number = parseInt(session.split('-')[2]);
        // console.log(`Year: ${year}, Month: ${month}, Day: ${day}`);
        return new Date(year, month, day);
      });
      C.sessions = sessions;

      // C.next_session = new Date();
      // Add next-Session
      let splitNext: string[] = campaign.next_session.split('-');
      let year: number = parseInt(splitNext[0]);
      let month: number = parseInt(splitNext[1]) - 1;
      let day: number = parseInt(splitNext[2].split('|')[0]);
      let hour: number = parseInt(splitNext[2].split('|')[1].substring(0,2));
      let minute: number = parseInt(splitNext[2].split('|')[1].substring(2,4));
      // console.log(`Next Session: ${year} - ${month} - ${day} | ${hour}`);
      C.next_session = new Date(year, month, day, hour, minute);
      // console.log(C.next_session);

      this.campaigns.push(C);

    });
  }
  
  getCampaigns(): Observable<_Campaign[]> {
    return of(this.campaigns);
  }

  getCampaignByID(id:string): Observable<_Campaign> {
    return of(this.campaigns.filter(campaign => campaign.id === id)[0]);
  }
}
