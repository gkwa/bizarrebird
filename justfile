# Show available commands
default:
    just --list

# Install dependencies and set up project
setup:
    pnpm install

# Clean up dependencies and build artifacts
teardown:
    rm -rf node_modules
    rm -rf dist

# Run tests
test:
    pnpm test
