import LogicalClockLWWResolver from "../logicalClockLwwResolver";
import { Document, Event } from "../types";

describe("LogicalClockLWWResolver", () => {
  let resolver: LogicalClockLWWResolver;
  let baseDoc: Document;

  beforeEach(() => {
    resolver = new LogicalClockLWWResolver();
    baseDoc = {
      id: "doc-1",
      title: "Original Title",
      description: "Original description",
      logicalClock: 1,
      isDeleted: false,
    };
  });

  describe("shouldApplyEvent", () => {
    it("returns true when the event has a higher logical clock", () => {
      const event: Event = {
        id: "evt-1",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 2,
        type: "RenameDocument",
        payload: { title: "New Title" },
      };

      expect(resolver.shouldApplyEvent(baseDoc, event)).toBe(true);
    });

    it("returns false when the document is deleted and event is not a delete", () => {
      const deletedDoc: Document = { ...baseDoc, isDeleted: true };
      const event: Event = {
        id: "evt-2",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 2,
        type: "RenameDocument",
        payload: { title: "Irrelevant" },
      };

      expect(resolver.shouldApplyEvent(deletedDoc, event)).toBe(false);
    });

    it("returns false when the event has an equal or lower logical clock", () => {
      const event: Event = {
        id: "evt-3",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 1,
        type: "RenameDocument",
        payload: { title: "Same Clock" },
      };

      expect(resolver.shouldApplyEvent(baseDoc, event)).toBe(false);
    });
  });

  describe("applyEvent", () => {
    it("renames the document when the event should be applied", () => {
      const renameEvent: Event = {
        id: "evt-4",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 3,
        type: "RenameDocument",
        payload: {
          title: "Renamed Title",
          description: "Updated description",
        },
      };

      const updatedDoc = resolver.applyEvent(baseDoc, renameEvent);

      expect(updatedDoc.title).toBe("Renamed Title");
      expect(updatedDoc.description).toBe("Updated description");
      expect(updatedDoc.logicalClock).toBe(renameEvent.logicalClock);
    });

    it("deletes the document when receiving a DeleteDocument event", () => {
      const deleteEvent: Event = {
        id: "evt-5",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 4,
        type: "DeleteDocument",
        payload: {},
      };

      const deletedDoc = resolver.applyEvent(baseDoc, deleteEvent);

      expect(deletedDoc.isDeleted).toBe(true);
      expect(deletedDoc.logicalClock).toBe(deleteEvent.logicalClock);
    });

    it("returns the current document unmodified when the event should not be applied", () => {
      const lowerClockEvent: Event = {
        id: "evt-6",
        deviceId: "device-1",
        documentId: "doc-1",
        logicalClock: 0,
        type: "RenameDocument",
        payload: { title: "Should Not Apply" },
      };

      const resultDoc = resolver.applyEvent(baseDoc, lowerClockEvent);

      expect(resultDoc).toEqual(baseDoc);
    });
  });
});
