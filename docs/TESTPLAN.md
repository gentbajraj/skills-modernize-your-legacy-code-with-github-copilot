# Test Plan - Account Management System

## Overview
This test plan validates the business logic and functionality of the Account Management System. The test cases cover all operations including balance inquiry, credits, debits, and business rules enforcement.

**Target Application**: Student Account Management System (COBOL)  
**Migration Target**: Node.js Application  
**Test Plan Version**: 1.0  
**Date**: December 15, 2025

---

## Test Case Summary

| Category | Test Cases |
|----------|-----------|
| Initialization & Setup | TC-001 to TC-002 |
| View Balance Operation | TC-003 to TC-004 |
| Credit Account Operation | TC-005 to TC-009 |
| Debit Account Operation | TC-010 to TC-017 |
| Menu Navigation | TC-018 to TC-021 |
| Business Rules Validation | TC-022 to TC-026 |
| Edge Cases & Boundaries | TC-027 to TC-032 |

---

## Test Cases

### Initialization & Setup

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-001 | Verify initial balance on application start | Application not running | 1. Start application<br>2. Select option 1 (View Balance) | Display shows "Current balance: 1000.00" | | | Initial balance should be $1,000.00 |
| TC-002 | Verify menu display on startup | Application not running | 1. Start application<br>2. Observe menu display | Menu displays with options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Menu should display all four options |

---

### View Balance Operation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-003 | View balance with initial amount | Application started, no transactions performed | 1. Select option 1<br>2. Observe displayed balance | Display shows "Current balance: 1000.00"<br>Return to main menu | | | Validates READ operation from DataProgram |
| TC-004 | View balance after transactions | Application started, transactions performed (e.g., +$200 credit) | 1. Perform a credit of $200<br>2. Select option 1<br>3. Observe displayed balance | Display shows "Current balance: 1200.00"<br>Return to main menu | | | Validates balance persistence |

---

### Credit Account Operation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-005 | Credit account with valid amount | Application started, current balance: $1,000.00 | 1. Select option 2<br>2. Enter amount: 250.00<br>3. Observe result | Display shows "Amount credited. New balance: 1250.00"<br>Return to main menu | | | Standard credit operation |
| TC-006 | Credit account with decimal amount | Application started, current balance: $1,000.00 | 1. Select option 2<br>2. Enter amount: 123.45<br>3. Observe result | Display shows "Amount credited. New balance: 1123.45"<br>Return to main menu | | | Tests decimal precision |
| TC-007 | Credit account with whole number | Application started, current balance: $1,000.00 | 1. Select option 2<br>2. Enter amount: 500<br>3. Observe result | Display shows "Amount credited. New balance: 1500.00"<br>Return to main menu | | | Tests whole number handling |
| TC-008 | Multiple sequential credits | Application started, current balance: $1,000.00 | 1. Credit $100<br>2. Credit $200<br>3. Credit $300<br>4. View balance | Each credit successful<br>Final balance: $1,600.00 | | | Tests multiple transactions |
| TC-009 | Credit small amount (0.01) | Application started, current balance: $1,000.00 | 1. Select option 2<br>2. Enter amount: 0.01<br>3. Observe result | Display shows "Amount credited. New balance: 1000.01"<br>Return to main menu | | | Tests minimum precision (1 cent) |

---

### Debit Account Operation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-010 | Debit account with valid amount (sufficient funds) | Application started, current balance: $1,000.00 | 1. Select option 3<br>2. Enter amount: 300.00<br>3. Observe result | Display shows "Amount debited. New balance: 700.00"<br>Return to main menu | | | Standard debit operation |
| TC-011 | Debit account - insufficient funds | Application started, current balance: $1,000.00 | 1. Select option 3<br>2. Enter amount: 1500.00<br>3. Observe result<br>4. Verify balance unchanged | Display shows "Insufficient funds for this debit."<br>Balance remains $1,000.00 | | | **Critical business rule** |
| TC-012 | Debit exact balance amount | Application started, current balance: $1,000.00 | 1. Select option 3<br>2. Enter amount: 1000.00<br>3. Observe result | Display shows "Amount debited. New balance: 0.00"<br>Return to main menu | | | Tests boundary condition |
| TC-013 | Debit with decimal amount | Application started, current balance: $1,000.00 | 1. Select option 3<br>2. Enter amount: 99.99<br>3. Observe result | Display shows "Amount debited. New balance: 900.01"<br>Return to main menu | | | Tests decimal precision |
| TC-014 | Debit from zero balance | Balance reduced to $0.00 | 1. Select option 3<br>2. Enter amount: 0.01<br>3. Observe result | Display shows "Insufficient funds for this debit."<br>Balance remains $0.00 | | | Tests zero balance edge case |
| TC-015 | Multiple sequential debits | Application started, current balance: $1,000.00 | 1. Debit $100<br>2. Debit $200<br>3. Debit $300<br>4. View balance | Each debit successful<br>Final balance: $400.00 | | | Tests multiple transactions |
| TC-016 | Debit after balance becomes insufficient | Current balance: $500.00 | 1. Debit $300 (success)<br>2. Debit $300 (should fail)<br>3. View balance | First debit: balance $200.00<br>Second debit: "Insufficient funds"<br>Final balance: $200.00 | | | Tests running balance validation |
| TC-017 | Debit small amount (0.01) | Application started, current balance: $1,000.00 | 1. Select option 3<br>2. Enter amount: 0.01<br>3. Observe result | Display shows "Amount debited. New balance: 999.99"<br>Return to main menu | | | Tests minimum precision |

---

### Menu Navigation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-018 | Exit application | Application running | 1. Select option 4<br>2. Observe result | Display shows "Exiting the program. Goodbye!"<br>Application terminates | | | Tests graceful exit |
| TC-019 | Invalid menu option (out of range) | Application running | 1. Enter option: 5<br>2. Observe result | Display shows "Invalid choice, please select 1-4."<br>Return to main menu | | | Tests input validation |
| TC-020 | Invalid menu option (non-numeric) | Application running | 1. Enter option: 'abc'<br>2. Observe result | Display error message or handle gracefully<br>Return to main menu | | | Tests non-numeric input handling |
| TC-021 | Navigate all menu options in sequence | Application running | 1. Select option 1 (View)<br>2. Select option 2 (Credit $100)<br>3. Select option 3 (Debit $50)<br>4. Select option 1 (View)<br>5. Select option 4 (Exit) | All operations execute successfully<br>Final balance: $1,050.00<br>Application exits | | | Tests full workflow |

---

### Business Rules Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-022 | Verify insufficient funds protection | Current balance: $100.00 | 1. Attempt to debit $100.01<br>2. Verify balance unchanged | Transaction rejected with message<br>Balance remains $100.00 | | | **Critical**: Prevents overdraft |
| TC-023 | Verify balance persistence within session | Application running | 1. Credit $500<br>2. View balance<br>3. Debit $200<br>4. View balance | After credit: $1,500.00<br>After debit: $1,300.00 | | | Tests in-memory persistence |
| TC-024 | Verify balance reset on application restart | Application restarted | 1. Exit application<br>2. Restart application<br>3. View balance | Balance shows initial $1,000.00 | | | Confirms session-based storage |
| TC-025 | Verify maximum balance limit | Current balance close to max | 1. Credit amount to approach limit<br>2. Verify transaction handling | Transaction succeeds if within PIC 9(6)V99 limit ($999,999.99)<br>May fail or overflow if exceeded | | | Tests upper boundary |
| TC-026 | Verify precision to 2 decimal places | Application running | 1. Credit $0.01<br>2. View balance<br>3. Debit $0.01<br>4. View balance | Balance accurately reflects cent-level precision<br>Original balance restored | | | Tests decimal handling |

---

### Edge Cases & Boundaries

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-027 | Maximum single credit amount | Application started, current balance: $1,000.00 | 1. Credit $998,999.99<br>2. View balance | Transaction successful (if within limits)<br>Balance: $999,999.99 | | | Tests maximum allowable balance |
| TC-028 | Credit causing balance overflow | Current balance: $999,000.00 | 1. Attempt to credit $2,000.00<br>2. Observe behavior | System handles overflow appropriately (reject or wrap)<br>Document behavior for migration | | | **Important for migration** |
| TC-029 | Debit amount equals balance exactly | Current balance: $1,234.56 | 1. Debit $1,234.56<br>2. View balance | Transaction successful<br>Balance: $0.00 | | | Tests exact match boundary |
| TC-030 | Debit amount one cent more than balance | Current balance: $1,234.56 | 1. Debit $1,234.57<br>2. View balance | Transaction rejected: "Insufficient funds"<br>Balance: $1,234.56 | | | Tests boundary validation |
| TC-031 | Zero amount credit | Application running | 1. Attempt to credit $0.00<br>2. Observe behavior | Document system behavior (accept or reject)<br>Balance change (if any) | | | Edge case for migration |
| TC-032 | Zero amount debit | Application running | 1. Attempt to debit $0.00<br>2. Observe behavior | Document system behavior (accept or reject)<br>Balance change (if any) | | | Edge case for migration |

---

## Test Execution Guidelines

### For Business Stakeholder Validation:
1. Execute test cases in order within each category
2. Document any deviations from expected results in the "Comments" column
3. Focus on business rules (TC-022 to TC-026) for stakeholder approval
4. Validate that insufficient funds protection (TC-011, TC-022) works correctly

### For Node.js Migration:
1. **Unit Tests**: Create individual tests for each operation (View, Credit, Debit)
2. **Integration Tests**: Use TC-021 and sequential operation tests (TC-008, TC-015, TC-016)
3. **Edge Cases**: Implement all boundary tests (TC-027 to TC-032) to match COBOL behavior
4. **Error Handling**: Ensure Node.js app handles invalid inputs (TC-019, TC-020)

### Critical Test Cases for Migration:
- **TC-001**: Initial balance validation
- **TC-011**: Insufficient funds rejection
- **TC-012**: Exact balance debit
- **TC-022**: Overdraft protection
- **TC-023**: Balance persistence within session
- **TC-024**: Balance reset behavior
- **TC-026**: Decimal precision

---

## Testing Environment

### Current COBOL Environment:
- **Compiler**: GnuCOBOL (cobc)
- **Platform**: Linux (Ubuntu 22.04.5 LTS)
- **Execution**: `./accountsystem`

### Future Node.js Environment:
- **Runtime**: Node.js (version TBD)
- **Testing Framework**: Jest / Mocha / Chai (TBD)
- **Test Types**: Unit tests, Integration tests, E2E tests

---

## Test Data

| Scenario | Initial Balance | Transaction Amount | Expected Final Balance |
|----------|----------------|-------------------|----------------------|
| Standard Credit | $1,000.00 | +$250.00 | $1,250.00 |
| Standard Debit | $1,000.00 | -$300.00 | $700.00 |
| Insufficient Funds | $1,000.00 | -$1,500.00 | $1,000.00 (unchanged) |
| Zero Balance | $0.00 | -$0.01 | $0.00 (rejected) |
| Maximum Balance | $999,000.00 | +$999.99 | $999,999.99 |
| Decimal Precision | $1,000.00 | +$0.01 | $1,000.01 |

---

## Notes for Node.js Migration

### Behavior to Preserve:
1. ✅ Initial balance of $1,000.00
2. ✅ Insufficient funds validation before debit
3. ✅ Two decimal place precision
4. ✅ Balance persistence within session
5. ✅ Graceful error messages
6. ✅ Menu-driven interface (can be adapted to API endpoints)

### Behavior to Document:
1. ❓ Handling of negative input amounts
2. ❓ Handling of non-numeric input
3. ❓ Maximum transaction limits
4. ❓ Balance overflow behavior
5. ❓ Zero amount transaction handling

### Enhancements for Node.js:
1. 🔄 Persistent storage (database instead of in-memory)
2. 🔄 Transaction history/audit log
3. 🔄 Multiple account support
4. 🔄 Input validation middleware
5. 🔄 RESTful API endpoints
6. 🔄 Automated test suite
7. 🔄 Error logging and monitoring

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Plan Author | | | |
| Business Stakeholder | | | |
| Technical Lead | | | |
| QA Lead | | | |

---

**End of Test Plan**
