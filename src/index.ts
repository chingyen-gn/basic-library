import { greet, add } from './utils';

/**
 * Main function to demonstrate the basic library
 */
function main(): void {
  console.log('Welcome to Basic Library!');
  console.log(greet('TypeScript'));
  console.log(`Addition result: ${add(5, 3)}`);
}

// Export main functions for library usage
export { greet, add } from './utils';

// Run main function if this file is executed directly
if (require.main === module) {
  main();
} 