# BizarreBird

A simple graph visualization tool using graphology with GraphML export capabilities.

## Features

- Create and visualize graph structures
- Export graphs to GraphML format
- Interactive visualization of nodes and edges

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository
2. Set up the project:

```bash
just setup
```

3. Start the development server:

```bash
pnpm dev
```

## Development

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview the production build
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

### Just Commands

This project uses `just` as a command runner:

- `just setup` - Install dependencies and set up the project
- `just test` - Run unit tests
- `just teardown` - Clean up dependencies and build artifacts

## Technologies Used

- [Graphology](https://graphology.github.io/) - For graph data structure and operations
- [graphology-graphml](https://graphology.github.io/standard-library/graphml.html) - For GraphML import/export
- [Vite](https://vitejs.dev/) - For development and building
- [Vitest](https://vitest.dev/) - For testing
- [React](https://reactjs.org/) - For UI components
