# Kong Gateway E2E Testing Suite

## Table of Contents

- [The Assignment](#the-assignment)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Multi Environment Configuration](#multi-environment-configuration)
- [Test Reporting & XRAY Integration](#test-reporting--xray-integration)
- [Test Coverage](#test-coverage)
- [Design Decisions](#design-decisions)
- [Assumptions Made](#assumptions-made)
- [Trade-offs Considered](#trade-offs-considered)
- [CI/CD Pipeline](#cicd-pipeline)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## The Assignment

### Reference Documentation

- **Gateway Services**: https://docs.konghq.com/gateway/latest/key-concepts/services
- **Docker Deployment**: https://developer.konghq.com/gateway/install/docker/
- **Gateway Configuration**: https://developer.konghq.com/gateway/configuration/

### Technical Requirements

**Toolchain**: Freedom to choose between Cypress with JavaScript or TypeScript

### Assignment Steps

#### **Setup Phase**

1. Download the Docker-Compose file
2. Navigate to the directory containing `docker-compose.yml`
3. Run `docker-compose up -d`
4. Navigate to http://localhost:8002/ in your browser
5. Verify access to Kong Gateway UI (Kong Manager)
6. **Note**: "No valid Kong license configured" pop-up is expected

#### **Core Testing Requirements**

1. **Service Creation**: Complete the full flow to create a new Service from scratch using the UI
2. **Associated Entities**: Create additional entities associated with a Service (e.g., Routes)

#### **Bonus Features**

- **Test Result Reporting**: Implement comprehensive test reporting
- **Continuous Integration**: Set up automated test execution (e.g., GitHub Actions)

#### **Teardown Phase**

- Run `docker-compose down` to shut down Docker services

### Submission Guidelines

- **Timeline**: One week to complete (estimated effort: few days)
- **Delivery**: Public GitHub repository link
- **Documentation**: Include README with:
  - Local setup and execution instructions
  - Design considerations and assumptions
  - Trade-offs made during development

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/alecmestroni/kong-assignment.git
cd kong-assignment

# Install dependencies
npm install

# Start Kong Gateway and PostgreSQL containers & Run tests (headless)
npm run test:run

# Start Kong Gateway and PostgreSQL containers & Open Cypress Test Runner
npm run test:open
```

## Available Scripts

| Script                  | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run docker:up`     | Start Kong Gateway and PostgreSQL containers       |
| `npm run docker:down`   | Stop and remove containers with volumes            |
| `npm run test:run`      | Docker setup & Run all tests headless              |
| `npm run test:open`     | Docker setup & Open Cypress Test Runner            |
| `npm run cy:run:local`  | Run tests (assumes Kong is already running)        |
| `npm run cy:open:local` | Open Test Runner (assumes Kong is already running) |

## Project Structure

```
kong-assignment/
├── cypress/
│   ├── e2e/
│   │   ├── Services/           # Service creation tests
│   │   │   ├── create-service-navigation.km.js
│   │   │   ├── create-service-protocol.km.js
│   │   │   └── create-service-url.km.js
│   │   └── Routes/             # Route creation tests
│   │       ├── create-route-basic.km.js
│   │       └── create-route-navigation.km.js
│   ├── fixtures/               # Test data
│   ├── support/
│   │   ├── kong-manager/       # Custom commands for Kong Manager
│   │   ├── common.js           # Shared utilities
│   │   └── kong-manager.js     # Main support file
│   └── screenshots/            # Test failure screenshots
├── env.config/
│   └── km.local.json          # Environment configuration
├── report/                    # XML test reports (generated)
├── docker-compose.yml         # Kong Gateway setup
├── cypress.config.js          # Cypress configuration
└── package.json
```

## Multi Environment Configuration

### Test Environment Configuration

This project uses `cypress-env` to handle multi environment easily.

Environment settings for local environment are saved in `env.config/km.local.json`.

### Environment Variables Structure

The configuration file is organized into logical sections:

- **Base Configuration**: `baseUrl`, viewport dimensions for consistent test execution
- **Core Environment Variables**: Kong Admin URL, workspace settings, test service endpoints
- **Application Paths**: Centralized UI route definitions (`/services`, `/routes`, `/consumers`, etc.)
- **UI Selectors**: Data-testid and CSS selectors for form inputs, buttons, and navigation elements
- **Error Messages**: Expected system messages for validation testing
- **UI dataTestId**: Interface text for form validation and assertions
- **Temporary Variables**: Runtime data storage that gets cleaned between test runs

Every environment has some differences, so this modular approach ensures easy maintenance and supports multiple environments (local, staging, production) by simply switching configuration files.

## Test Reporting & Jira/XRAY Integration

### Jira Integration Test Management

This project uses `cypress-xray-junit-reporter` for Jira/Xray supported test reporting:

```javascript
// Each test includes JIRA integration
it(
  "should create Gateway Service successfully",
  { jiraKey: "KONG-6742" },
  () => {
    // Test implementation
  },
);
```

### Generated Reports

Tests generate XML reports compatible with:

- **XRAY** (Native Test Management for Jira)
- **GitHub Actions** (Artifact uploads)

Example XML output:

```xml
<testcase name="should create Gateway Service successfully" time="2.45">
  <properties>
    <property name="test_key" value="KONG-6742"/>
  </properties>
  <screenshot>cypress/screenshots/service-creation.png</screenshot>
</testcase>
```

### CI/CD Integration

GitHub Actions automatically:

- Runs tests on PR and push to main (two times to check for flakiness)
- Uploads test reports as artifacts
- Captures screenshots/videos on failure
- Provides test result visibility

## Test Coverage

### Gateway Services (12 tests)

- **Navigation Flows**: Access service creation from multiple entry points
- **URL Form**: Create services using URL input method
- **Protocol Form**: Create services using protocol/host/path method
- **Validation**: Client-side and server-side validation testing

### Routes (7 tests)

- **Navigation Flows**: Access route creation from multiple entry points
- **Basic Creation**: Create routes with path-only configuration
- **Service Association**: Create routes linked to existing services
- **Form Validation**: Ensure proper form state management

### JIRA Test Keys

All tests include randomized JIRA keys (KONG-XXXX format) for traceability:

### **Services Test Suite:**

| JIRA Key  | Test Case Description                      |
| --------- | ------------------------------------------ |
| KONG-8472 | Service navigation from workspace overview |
| KONG-5936 | Service navigation from empty state        |
| KONG-2147 | Service navigation from add button         |
| KONG-9583 | Protocol form validation (disabled state)  |
| KONG-7261 | Protocol form browser validation           |
| KONG-4819 | Protocol form validation bypass            |
| KONG-3095 | Protocol form server validation            |
| KONG-6742 | Protocol form successful creation          |
| KONG-1583 | URL form validation (disabled state)       |
| KONG-8924 | URL form browser validation                |
| KONG-5076 | URL form validation bypass                 |
| KONG-2368 | URL form server validation                 |
| KONG-7451 | URL form successful creation               |

### **Routes Test Suite:**

| JIRA Key  | Test Case Description                    |
| --------- | ---------------------------------------- |
| KONG-5784 | Route navigation from service page       |
| KONG-3921 | Route navigation from workspace overview |
| KONG-6203 | Route navigation from empty state        |
| KONG-7865 | Route navigation from add button         |
| KONG-9127 | Route form validation (disabled state)   |
| KONG-4652 | Route creation with path only            |
| KONG-8316 | Route creation with service association  |

## Design Decisions

### Technology Stack

- **Cypress with JavaScript**: Chosen for its excellent developer experience and debugging capabilities. JavaScript was preferred over TypeScript for faster development and familiarity
- **Multi-reporter**: Combines spec output for development with XML for CI/CD
- **cypress-xray-junit-reporter**: Custom library (created by me) for professional XRAY/JIRA integration
- **cypress-env**: Custom library (created by me) for flexible environment configuration

### Test Architecture

- **Environment Cleanup/Isolation**: Each test run uses fresh containers. Global configuration ensures environment cleanup before and after tests:

  ```javascript
  before("clean environment", () => {
    cy.cleanEnvironment();
  });

  after("clean environment", () => {
    cy.cleanEnvironment();
  });
  ```

- **Custom Commands**: Configured a dedicated `support/kong-manager.js` support file. This modular approach allows multiple applications to be tested in the same repository, with each application loading only its specific code. Reusable functions are organized in `cypress/support/kong-manager/`
- **Contract Testing**: Fixtures for consistent test data
- **Retry Logic**: Configured retries for stability in CI environments. Cross-origin exceptions are handled (likely related to Cypress v15)

### Reporting Strategy

- **Local Development**: Spec reporter for immediate feedback
- **CI/CD**: JUnit XML for integration with external tools
- **Jira**: XRAY integration for test management directly in board
- **Artifacts**: Screenshots and videos preserved for debugging

## Assumptions Made

1. **Kong Manager UI**: Tests assume Kong Manager is available at localhost:8002
2. **Kong Manager API**: Tests assume Kong Manager is available at localhost:8001
3. **Default Workspace**: Tests run against the 'default' workspace

## Trade-offs Considered

### Stability vs Speed

- **Choice**: Prioritized stability with retries. No `cy.wait()` is used except at two specific points where we verify the absence of API calls.
- **Trade-off**: Slightly slower execution for more reliable results
- **Rationale**: CI environments benefit from stable tests over fast flaky ones

### Test Isolation vs Performance

- **Choice**: Full environment reset between test suites
- **Trade-off**: Longer setup time vs guaranteed clean state
- **Rationale**: Prevents test interdependencies

### Reporting Complexity vs Integration

- **Choice**: Multi-reporter setup with XRAY integration
- **Trade-off**: More complex configuration in return for professional requirements
- **Rationale**: Business environments require test traceability and management. Everyone can open a Jira ticket, but not many can check pipeline logs.

## CI/CD Pipeline

The project includes GitHub Actions workflow that:

1. **Setup**: Install Node.js, Docker, dependencies
2. **Test Execution**: Run tests twice for stability validation
3. **Artifact Collection**: Upload reports, screenshots, videos
4. **Cleanup**: Properly tear down Docker containers

### Branch Protection

The repository enforces strict quality controls through GitHub branch protection rules:

- **Ruleset**: `Test on Main (Push & PR)` - Blocks any merge or direct commit to main branch if tests fail
- **Required Status Checks**: All CI tests must pass before code can be merged
- **Quality Gate**: Ensures no broken code reaches the main branch

View the workflow: `.github/workflows/test.yml`

## End of the Readme!

Happy testing to everyone!

ALEC-JS
