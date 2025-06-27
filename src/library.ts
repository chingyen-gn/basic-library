import { Event, Document, EventType, Command } from "./types";

class Library {
    private userId: string;
    private documents: Map<string, Document> = new Map();
  
    constructor(userId: string) {
      this.userId = userId;
    }
  
    async initialize(): Promise<void> {
      try {
        const rawEvents = await this.fetchEventsFromAPI();
        const events = rawEvents as Event[];
        this.processEvents(events);
      } catch (error) {
        console.error('Failed to initialize library:', error);
      }
    }
  
    processEvents(events: Event[]): void {
      for (const event of events) {
        this.processEvent(event);
      }
    }
  
    private processEvent(event: Event): void {
        //TODO
        console.log(event);
    }
  
    private async fetchEventsFromAPI(): Promise<any> {
      // mock response
      return [
        {
          id: '1',
          deviceId: 'ipad-001',
          logicalClock: 0,
          type: 'CREATE',
          documentId: 'a7f3c9',
          payload: {
            title: 'Music sheet',
            description: "Ed sheeran's song"
          }
        },
        {
          id: "2",
          deviceId: "ipad-001",
          logicalClock: 1,
          type: "UPDATE",
          documentId: "a7f3c9",
          payload: {
            title: "Music sheet - Ed Sheeran"
          }
        },
        {
          id: "3", 
          deviceId: "ipad-001",
          logicalClock: 2,
          type: "DELETE",
          documentId: "a7f3c9",
          payload: {}
        }
      ];
      // const response = await fetch(`/api/events/${this.userId}`);
      // return response.json();
    }
  }

export default Library;