import { Event } from "./types";
import { EventEmitter } from "events";

class MockClient extends EventEmitter {
    private events: Event[];

    constructor(preloadedEvents: Event[] = []) {
        super();
        this.events = [...preloadedEvents];
    }

    public addEvent(event: Event): void {
        console.log(`Event received: ${event.type}\n`);
        this.events.push(event);
        this.emit('change', [...this.events]);
    }

    public getEvents(): Event[] {
        return [...this.events];
    }

    /**
     * Subscribe to changes in the events array. The callback receives
     * the latest snapshot every time an event is added.
     */
    public onChange(listener: (events: Event[]) => void): void {
        this.on('change', listener);
    }
}

export const mockEvents = [
    {
      id: '1',
      deviceId: 'ipad-001',
      logicalClock: 0,
      type: 'CreateDocument' as const,
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
      type: "RenameDocument" as const,
      documentId: "a7f3c9",
      payload: {
        title: "Music sheet - Ed Sheeran"
      }
    },
    {
      id: "3", 
      deviceId: "ipad-001",
      logicalClock: 2,
      type: "DeleteDocument" as const,
      documentId: "a7f3c9",
      payload: {}
    }
  ];

export default MockClient;
