import { Command, Event } from "./types";

class LogicalClockService {
    private logicalClock = 0;
    private deviceId: string;

    constructor() {
        this.deviceId = this.generateDeviceId();
    }

    receiveEvent(event: Event): void {
        this.logicalClock = Math.max(this.logicalClock, event.logicalClock);
    }

    generateEvent(command: Command): Event {
        this.logicalClock++;

        return {
            id: this.generateEventId(),
            deviceId: this.deviceId,
            logicalClock: this.logicalClock,
            type: command.type,
            documentId: command.args.documentId || this.generateDocumentId(),
            payload: {
                title: command.args.title,
                description: command.args.description
            }
        };
    }

    private generateDeviceId(): string {
        return 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private generateEventId(): string {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private generateDocumentId(): string {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

export default LogicalClockService;
