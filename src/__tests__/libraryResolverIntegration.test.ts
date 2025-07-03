import { Library } from "../library";
import LogicalClockService from "../logicalClockService";
import MockClient from "../mockClient";
import { Command, Event } from "../types";


describe("Library integration", () => {
    let logicalClockService: LogicalClockService;
    let client: MockClient;
    let library: Library;

    beforeEach(() => {
        logicalClockService = new LogicalClockService();
        client = new MockClient();
        library = new Library("user-1", client, logicalClockService);
    });

    it("updates the logical clock when an event is received", () => {
        const firstEvent: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 0,
            type: "CreateDocument",
            documentId: "doc-1",
            payload: {
                title: "Pizza",
                description: "Some description",
            },
        };

        const secondEvent: Event = {
            id: "evt-002",
            deviceId: "dev-1",
            logicalClock: 4,
            type: "RenameDocument",
            documentId: "doc-1",
            payload: {
                title: "Pizza with cheese",
            },
        };

        library.processEvents([firstEvent, secondEvent]);

        const newCommand: Command = {
            type: "RenameDocument",
            args: {
                documentId: "doc-1",
                title: "Pizza with cheese and pineapples",
            },
        };

        const thirdEvent = logicalClockService.generateEvent(newCommand);       

        expect(thirdEvent.logicalClock).toBe(5);
    });

    it("applies a create event and ensures that the document has a unique title", () => {
        const createDocumentEvent1: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 0,
            type: "CreateDocument",
            documentId: "doc-1",
            payload: {
                title: "Literature",
                description: "Some description",
            },
        };

        const createDocumentEvent2: Event = {
            id: "evt-002",
            deviceId: "dev-1",
            logicalClock: 3,
            type: "CreateDocument",
            documentId: "doc-2",
            payload: {
                title: "Literature",
                description: "Conflicting titles",
            },
        };

        library.processEvents([createDocumentEvent1, createDocumentEvent2]);

        const docs = library.getDocuments();

        expect(docs).toHaveLength(2);
        expect(docs[0].title).toBe("Literature");
        expect(docs[1].title).toBe("Literature (2)");
    });

    it("ignores a rename event with a smaller logical clock", () => {
        const createDocumentEvent: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 3,
            type: "CreateDocument",
            documentId: "doc-1",
            payload: {
                title: "Thailand",
                description: "Some description",
            },
        };

        const renameDocumentEvent: Event = {
            id: "evt-002",
            deviceId: "dev-1",
            logicalClock: 2,
            type: "RenameDocument",
            documentId: "doc-1",
            payload: {
                title: "Siam",
                description: "Should not update",
            },
        };

        library.processEvents([createDocumentEvent, renameDocumentEvent]);

        const docs = library.getDocuments();

        expect(docs).toHaveLength(1);
        expect(docs[0].title).toBe("Thailand");
    });

    it("applies a rename event with a greater logical clock", () => {
        const createDocumentEvent: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 1,
            type: "CreateDocument",
            documentId: "doc-2",
            payload: {
                title: "Turkey",
            },
        };

        const renameDocumentEvent: Event = {
            id: "evt-002",
            deviceId: "dev-1",
            logicalClock: 5,
            type: "RenameDocument",
            documentId: "doc-2",
            payload: {
                title: "Turkiye",
            },
        };

        library.processEvents([createDocumentEvent, renameDocumentEvent]);

        const docs = library.getDocuments();

        expect(docs).toHaveLength(1);
        expect(docs[0].title).toBe("Turkiye");
    });

    it("applies a delete event, regardless of the logical clock", () => {
        const createDocumentEvent: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 11,
            type: "CreateDocument",
            documentId: "doc-1",
            payload: {
                title: "2023",
                description: "Some description",
            },
        };

        const deleteDocumentEvent: Event = {
            id: "evt-002",  
            deviceId: "dev-1",
            logicalClock: 2,
            type: "DeleteDocument",
            documentId: "doc-1",
            payload: {},
        };

        library.processEvents([createDocumentEvent, deleteDocumentEvent]);  

        const docs = library.getDocuments();

        expect(docs).toHaveLength(0);
    }); 

    it('ignores a rename event if the document is deleted', () => {
        const createDocumentEvent: Event = {
            id: "evt-001",
            deviceId: "dev-1",
            logicalClock: 1,
            type: "CreateDocument",
            documentId: "doc-1",
            payload: {
                title: "2024",
            },
        };

        const deleteDocumentEvent: Event = {
            id: "evt-002",
            deviceId: "dev-1",
            logicalClock: 2,
            type: "DeleteDocument",
            documentId: "doc-1",
            payload: {},
        };

        const renameDocumentEvent: Event = {
            id: "evt-003",
            deviceId: "dev-1",
            logicalClock: 3,
            type: "RenameDocument",
            documentId: "doc-1",
            payload: {
                title: "Last year",
            },
        };

        library.processEvents([createDocumentEvent, deleteDocumentEvent, renameDocumentEvent]);

        const docs = library.getDocuments();
 
        expect(docs).toHaveLength(0);   // deleted documents are not returned
    });     
}); 