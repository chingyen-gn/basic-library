import * as readline from 'readline';
import { Command } from './types';
import LogicalClockService from './logicalClockService';
import MockClient, { mockEvents } from './mockClient';
import { Library } from './library';


const client = new MockClient(mockEvents); 
const logicalClockService = new LogicalClockService();
const library = new Library("user-1", client, logicalClockService);

async function main(): Promise<void> {
  await library.initialize();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    showMenu();
    const answer = await askQuestion(rl, 'Select a command (1-3): ');
    await handleUserChoice(answer, rl);
  }
}

function showMenu(): void {
  console.log("--------------------------------");
  console.log("1. Create document");
  console.log("2. Rename document");
  console.log("3. Delete document");
  console.log(""); 
}

function askQuestion(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function handleUserChoice(choice: string, rl: readline.Interface): Promise<void> {
  const trimmedChoice = choice.trim();
  let command: Command | undefined;
  
  switch (trimmedChoice) {
    case '1': {
      const title = await askQuestion(rl, 'Set a title for the document: ');
      command = {
        type: 'CreateDocument',
        args: { title },
      };
      break;
    }
    case '2': {
      library.getDocuments().forEach((document) => {
        console.log(`${document.id} - ${document.title}`);
      });
      const documentId = await askQuestion(rl, 'Document ID to rename: ');
      const title = await askQuestion(rl, 'New title: ');
      command = {
        type: 'RenameDocument',
        args: {
          documentId,
          title,
        },
      };
      break;
    }
    case '3': {
      library.getDocuments().forEach((document) => {
        console.log(`${document.id} - ${document.title}`);
      });
      const documentId = await askQuestion(rl, 'Document ID to delete: ');
      command = {
        type: 'DeleteDocument',
        args: {
          documentId,
        },
      };
      break;
    }
    default:
      console.log("Invalid choice. Please enter 1, 2, or 3.");
      return;
  }
  
  console.log("");
  if (command) {
    const event = logicalClockService.generateEvent(command);
    client.addEvent(event);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
