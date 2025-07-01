import { Library } from "../library";
import MockClient from "../mockClient";
import { Document } from "../types";

// global.fetch = jest.fn();

describe("Library", () => {
  let library: Library;
  let client: MockClient;

  beforeEach(() => {
    client = new MockClient();
    library = new Library("test-user-123", client);
  });

  describe("getDocuments", () => {
    it("should return an empty array when no documents exist", () => {
      library = new Library("test-user-123", new MockClient());
      const result = library.getDocuments();
      expect(result).toEqual([]);
    });

    it("should return only non-deleted documents", () => {
      // Add some test documents
      const activeDoc: Document = {
        id: "doc-1",
        title: "Active Document",
        description: "This document is active",
        logicalClock: 1,
        isDeleted: false,
      };

      const deletedDoc: Document = {
        id: "doc-2",
        title: "Deleted Document",
        description: "This document is deleted",
        logicalClock: 2,
        isDeleted: true,
      };

      library.addDocument(activeDoc);
      library.addDocument(deletedDoc);

      const result = library.getDocuments();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(activeDoc);
      expect(result.find((doc) => doc.isDeleted)).toBeUndefined();
    });

    it("should return documents sorted by title in alphabetical order", () => {
      // Add documents in non-alphabetical order
      const docZ: Document = {
        id: "doc-z",
        title: "Zebra Document",
        logicalClock: 1,
        isDeleted: false,
      };

      const docA: Document = {
        id: "doc-a",
        title: "Apple Document",
        logicalClock: 2,
        isDeleted: false,
      };

      const docM: Document = {
        id: "doc-m",
        title: "Mango Document",
        logicalClock: 3,
        isDeleted: false,
      };

      library.addDocument(docZ);
      library.addDocument(docA);
      library.addDocument(docM);

      const result = library.getDocuments();

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Apple Document");
      expect(result[1].title).toBe("Mango Document");
      expect(result[2].title).toBe("Zebra Document");
    });
  });
});
