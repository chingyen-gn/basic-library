export interface Library {
  documents: Document[];
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  logicalClock: number;
  isDeleted: boolean;
}

export type CommandType = "CREATE" | "UPDATE" | "DELETE";

export interface Command {
  type: CommandType;
  args: {
    documentId?: string;
    title?: string;
    description?: string;
  };
}

export type EventType = "CREATE" | "UPDATE" | "DELETE";

export interface Event {
  id: string;
  deviceId: string;
  logicalClock: number;
  type: EventType;
  documentId: string;
  payload: {
    title?: string;
    description?: string;
  };
}

export interface CreateDocumentArgs {
  title: string;
  description?: string;
}

export interface UpdateDocumentArgs {
  documentId: string;
  title?: string;
  description?: string;
}

export interface DeleteDocumentArgs {
  documentId: string;
}

export interface CreateCommand extends Command {
  type: "CREATE";
  args: CreateDocumentArgs;
}

export interface UpdateCommand extends Command {
  type: "UPDATE";
  args: UpdateDocumentArgs;
}

export interface DeleteCommand extends Command {
  type: "DELETE";
  args: DeleteDocumentArgs;
}

export type DocumentCommand = CreateCommand | UpdateCommand | DeleteCommand;
