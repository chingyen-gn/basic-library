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

export type CommandType =
  | "CreateDocument"
  | "RenameDocument"
  | "DeleteDocument";

export interface Command {
  type: CommandType;
  args: {
    documentId?: string;
    title?: string;
    description?: string;
  };
}

export type EventType = "CreateDocument" | "RenameDocument" | "DeleteDocument";

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

export interface CreateDocumentCommand extends Command {
  type: "CreateDocument";
  args: CreateDocumentArgs;
}

export interface RenameDocumentCommand extends Command {
  type: "RenameDocument";
  args: UpdateDocumentArgs;
}

export interface DeleteDocumentCommand extends Command {
  type: "DeleteDocument";
  args: DeleteDocumentArgs;
}

export type DocumentCommand =
  | CreateDocumentCommand
  | RenameDocumentCommand
  | DeleteDocumentCommand;
