import { Event, Document } from "./types";

export class Library {
    private userId: string;
    private documents: Map<string, Document> = new Map();
    private apiClient: any;
  
    constructor(userId: string, apiClient: any) {
      this.userId = userId;
      this.apiClient = apiClient;
    }
  
    async initialize(): Promise<void> {
      console.log('Initializing library for user:', this.userId);
      try {
        const rawEvents = await this.apiClient.getEvents();
        const events = rawEvents as Event[];
        this.processEvents(events);
        this.apiClient.onChange((events: Event[]) => {
          this.processEvents(events);
        });
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

    getDocuments(): Document[] {
      return Array.from(this.documents.values())
        .filter(doc => !doc.isDeleted)
        .sort((a, b) => a.title.localeCompare(b.title));
    }

    // For testing purposes - add documents directly
    addDocument(document: Document): void {
      this.documents.set(document.id, document);
    }

    // For testing purposes - clear all documents
    clearDocuments(): void {
      this.documents.clear();
    }
  }

export default Library;