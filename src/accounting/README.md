# Account Management System - Test Suite

## Overview
Comprehensive unit test suite for the Node.js Account Management System, modernized from the COBOL legacy application. The tests mirror all scenarios documented in [TESTPLAN.md](../../docs/TESTPLAN.md).

## Test Coverage

### Test Categories Implemented

1. **Initialization & Setup** (TC-001 to TC-002)
   - Verify initial balance of $1,000.00
   - Validate DataProgram initialization

2. **View Balance Operation** (TC-003 to TC-004)
   - View initial balance
   - View balance after transactions

3. **Credit Account Operation** (TC-005 to TC-009)
   - Standard credits with valid amounts
   - Decimal precision handling
   - Multiple sequential credits
   - Minimum amount (0.01) credits

4. **Debit Account Operation** (TC-010 to TC-017)
   - Standard debits with sufficient funds
   - **Insufficient funds validation** (CRITICAL)
   - Exact balance debits
   - Decimal precision handling
   - Multiple sequential debits
   - Edge case: debit from zero balance

5. **Business Rules Validation** (TC-022 to TC-026)
   - Overdraft protection
   - Balance persistence within session
   - Balance reset on restart
   - Maximum balance limit ($999,999.99)
   - Two decimal place precision

6. **Edge Cases & Boundaries** (TC-027 to TC-032)
   - Maximum transaction amounts
   - Balance overflow protection
   - Exact balance matches
   - Zero amount handling
   - Negative amount handling
   - Non-numeric input validation
   - Transaction limit enforcement

7. **Integration Tests**
   - Complete workflows (View → Credit → Debit → View)
   - Mixed successful and failed transactions

## Installation

```bash
cd src/accounting
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Framework

- **Framework**: Jest 29.7.0
- **Test File**: `index.test.js`
- **Total Test Cases**: 40+ tests covering all TESTPLAN.md scenarios

## Test Structure

Each test follows this pattern:
1. **Arrange**: Set up DataProgram and Operations instances
2. **Act**: Execute the operation being tested
3. **Assert**: Verify expected behavior and output

Example:
```javascript
test('TC-011: Debit account - insufficient funds (CRITICAL)', async () => {
    const dataProgram = new DataProgram();
    const mockRl = createMockReadline(['1500']);
    const operations = new Operations(dataProgram, mockRl);
    
    const consoleSpy = jest.spyOn(console, 'log');
    
    await operations.debitAccount();
    
    expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
    expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    consoleSpy.mockRestore();
});
```

## Critical Test Cases

These tests validate the most important business rules from the COBOL application:

- ✅ **TC-001**: Initial balance validation ($1,000.00)
- ✅ **TC-011**: Insufficient funds rejection (CRITICAL)
- ✅ **TC-012**: Exact balance debit
- ✅ **TC-022**: Overdraft protection
- ✅ **TC-023**: Balance persistence within session
- ✅ **TC-024**: Balance reset behavior
- ✅ **TC-026**: Decimal precision (2 decimal places)

## Mocking Strategy

Tests use a mock readline interface to simulate user input:

```javascript
const createMockReadline = (inputs = []) => {
    let inputIndex = 0;
    return {
        question: jest.fn((query, callback) => {
            const input = inputs[inputIndex++] || '';
            callback(input);
        }),
        close: jest.fn()
    };
};
```

## Expected Test Results

All tests should pass, validating that the Node.js application:
1. Maintains the same business logic as the COBOL application
2. Properly validates insufficient funds before debits
3. Handles decimal precision correctly
4. Enforces maximum balance and transaction limits
5. Validates input and rejects invalid amounts
6. Preserves balance state within a session

## Continuous Integration

Add these tests to your CI/CD pipeline to ensure the modernized application maintains parity with the original COBOL system.

## Additional Test Files

- **Test Plan**: [docs/TESTPLAN.md](../../docs/TESTPLAN.md)
- **Application**: [index.js](./index.js)
- **Tests**: [index.test.js](./index.test.js)

## Notes

- All test cases from TESTPLAN.md are implemented
- Tests validate both successful and error scenarios
- Console output is mocked and verified in tests
- Balance precision is tested to 2 decimal places
- Edge cases include zero, negative, and non-numeric inputs
