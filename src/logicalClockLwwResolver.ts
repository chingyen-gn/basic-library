import { Document, Event } from "./types";

class LogicalClockLWWResolver {
  shouldApplyEvent(currentDoc: Document, event: Event): boolean {
    // Delete document is a terminal event, all events on the document are ignored
    if (currentDoc.isDeleted) {
      return false;
    }
    if (event.type === 'DeleteDocument') {
      return true;
    }

    if (event.logicalClock > currentDoc.logicalClock) {
      return true;
    }
    
    return false;
  }
  
  applyEvent(currentDoc: Document, event: Event): Document {
    if (!this.shouldApplyEvent(currentDoc, event)) {
      return currentDoc;
    }

    switch (event.type) {
      case 'RenameDocument':
        return {
          ...currentDoc,
          title: event.payload.title ?? currentDoc.title, 
          description: event.payload.description ?? currentDoc.description,
          logicalClock: event.logicalClock
        };

      case 'DeleteDocument':
        return {
          ...currentDoc,
          isDeleted: true,
          logicalClock: event.logicalClock
        };

      default:
        return currentDoc;
    }
  }
}

export default LogicalClockLWWResolver;
