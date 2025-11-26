import '@testing-library/jest-dom';

// Additional global test setup can go here.
// Tell React's test utilities that our environment supports `act`.
// This silences warnings about "The current testing environment is not configured to support act(...)"
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
