# Basic Library

A basic vanilla TypeScript project template with essential utilities.

## Features

- TypeScript configuration with strict type checking
- Utility functions for common operations
- Build and development scripts
- Type declarations generation

## Installation

```bash
npm install
```

## Usage

### Development

To build the project in watch mode:

```bash
npm run dev
```

### Build

To build the project:

```bash
npm run build
```

### Run

To run the compiled project:

```bash
npm start
```

### Clean

To clean the build directory:

```bash
npm run clean
```

## Library Usage

You can use the exported functions in your TypeScript/JavaScript projects:

```typescript
import { greet, add, isEven, capitalize } from 'basic-library';

console.log(greet('World')); // "Hello, World!"
console.log(add(2, 3)); // 5
console.log(isEven(4)); // true
console.log(capitalize('hello')); // "Hello"
```

## Project Structure

```
basic-library/
├── src/
│   ├── index.ts      # Main entry point
│   └── utils.ts      # Utility functions
├── dist/             # Compiled output (generated)
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## Development

This project uses TypeScript with strict type checking enabled. The source code is in the `src/` directory and compiles to the `dist/` directory. 