import LogicalClockLWWResolver from "./logicalClockLwwResolver";
import { Event, Document } from "./types";

export class Library {
    private userId: string;
    private documents: Map<string, Document> = new Map();
    private apiClient: any;
    private resolver: LogicalClockLWWResolver;
    
    constructor(userId: string, apiClient: any) {
      this.userId = userId;
      this.apiClient = apiClient;
      this.resolver = new LogicalClockLWWResolver();
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
      this.documents.clear();
      for (const event of events) {
        this.processEvent(event);
      }
      console.log('Documents after processing events:', this.documents);
    }
  
    private processEvent(event: Event): void {
        switch (event.type) {
            case 'CreateDocument':
                let title = event.payload.title ?? 'Untitled';
                // Check if the title is already in use
                const titles = Array.from(this.documents.values()).map(
                  (doc: Document) => doc.title
                );
                if (titles.includes(title)) {
                  title = `${title} (${this.documents.size + 1})`;
                }

                const newDoc = {
                  id: event.documentId,
                  title: title,
                  description: event.payload.description,
                  logicalClock: event.logicalClock,
                  isDeleted: false
                }
                this.documents.set(event.documentId, newDoc);
                break;
            case 'RenameDocument':                
                const docToRename = this.documents.get(event.documentId);
                if (docToRename) {
                  const newDoc = this.resolver.applyEvent(docToRename, event);
                  this.documents.set(event.documentId, newDoc);
                } else {
                  console.error(`Document ${event.documentId} not found`);
                }
                break;
            case 'DeleteDocument':
                const docToDelete = this.documents.get(event.documentId);
                if (docToDelete) {
                  const newDoc = this.resolver.applyEvent(docToDelete, event);
                  this.documents.set(event.documentId, newDoc);
                } else {
                  console.error(`Document ${event.documentId} not found`);
                }
                break;
            default:
                throw new Error(`Unknown event type: ${event.type}`);
                break;
        }
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