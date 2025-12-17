/**
 * Account Management System - Unit Tests
 * Test suite mirroring the COBOL Test Plan (TESTPLAN.md)
 * 
 * Test Categories:
 * - Initialization & Setup (TC-001 to TC-002)
 * - View Balance Operation (TC-003 to TC-004)
 * - Credit Account Operation (TC-005 to TC-009)
 * - Debit Account Operation (TC-010 to TC-017)
 * - Business Rules Validation (TC-022 to TC-026)
 * - Edge Cases & Boundaries (TC-027 to TC-032)
 */

const { DataProgram, Operations, MainProgram } = require('./index');

// Mock readline interface for testing
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

describe('Account Management System Tests', () => {
    
    // ========================================
    // Initialization & Setup Tests
    // ========================================
    
    describe('Initialization & Setup', () => {
        
        test('TC-001: Verify initial balance on application start', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.read();
            
            expect(balance).toBe(1000.00);
        });
        
        test('TC-002: Verify DataProgram initializes with correct balance', () => {
            const dataProgram = new DataProgram();
            
            expect(dataProgram.storageBalance).toBe(1000.00);
            expect(dataProgram.read()).toBe(1000.00);
        });
    });
    
    // ========================================
    // View Balance Operation Tests
    // ========================================
    
    describe('View Balance Operation', () => {
        
        test('TC-003: View balance with initial amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.viewBalance();
            
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
            consoleSpy.mockRestore();
        });
        
        test('TC-004: View balance after transactions', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['200']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Perform a credit of $200
            await operations.creditAccount();
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.viewBalance();
            
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1200.00');
            consoleSpy.mockRestore();
        });
    });
    
    // ========================================
    // Credit Account Operation Tests
    // ========================================
    
    describe('Credit Account Operation', () => {
        
        test('TC-005: Credit account with valid amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['250']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1250.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1250.00');
            consoleSpy.mockRestore();
        });
        
        test('TC-006: Credit account with decimal amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['123.45']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1123.45);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1123.45');
            consoleSpy.mockRestore();
        });
        
        test('TC-007: Credit account with whole number', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1500.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
            consoleSpy.mockRestore();
        });
        
        test('TC-008: Multiple sequential credits', async () => {
            const dataProgram = new DataProgram();
            const mockRl1 = createMockReadline(['100']);
            const mockRl2 = createMockReadline(['200']);
            const mockRl3 = createMockReadline(['300']);
            
            const ops1 = new Operations(dataProgram, mockRl1);
            const ops2 = new Operations(dataProgram, mockRl2);
            const ops3 = new Operations(dataProgram, mockRl3);
            
            await ops1.creditAccount();
            await ops2.creditAccount();
            await ops3.creditAccount();
            
            expect(dataProgram.read()).toBe(1600.00);
        });
        
        test('TC-009: Credit small amount (0.01)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.01);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1000.01');
            consoleSpy.mockRestore();
        });
    });
    
    // ========================================
    // Debit Account Operation Tests
    // ========================================
    
    describe('Debit Account Operation', () => {
        
        test('TC-010: Debit account with valid amount (sufficient funds)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['300']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(700.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
            consoleSpy.mockRestore();
        });
        
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
        
        test('TC-012: Debit exact balance amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['1000']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
            consoleSpy.mockRestore();
        });
        
        test('TC-013: Debit with decimal amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['99.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(900.01);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 900.01');
            consoleSpy.mockRestore();
        });
        
        test('TC-014: Debit from zero balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(0.00); // Set balance to zero
            
            const mockRl = createMockReadline(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });
        
        test('TC-015: Multiple sequential debits', async () => {
            const dataProgram = new DataProgram();
            const mockRl1 = createMockReadline(['100']);
            const mockRl2 = createMockReadline(['200']);
            const mockRl3 = createMockReadline(['300']);
            
            const ops1 = new Operations(dataProgram, mockRl1);
            const ops2 = new Operations(dataProgram, mockRl2);
            const ops3 = new Operations(dataProgram, mockRl3);
            
            await ops1.debitAccount();
            await ops2.debitAccount();
            await ops3.debitAccount();
            
            expect(dataProgram.read()).toBe(400.00);
        });
        
        test('TC-016: Debit after balance becomes insufficient', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(500.00); // Set starting balance
            
            const mockRl1 = createMockReadline(['300']);
            const mockRl2 = createMockReadline(['300']); // Should fail
            
            const ops1 = new Operations(dataProgram, mockRl1);
            const ops2 = new Operations(dataProgram, mockRl2);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await ops1.debitAccount(); // Success, balance = 200
            expect(dataProgram.read()).toBe(200.00);
            
            await ops2.debitAccount(); // Should fail
            expect(dataProgram.read()).toBe(200.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });
        
        test('TC-017: Debit small amount (0.01)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(999.99);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 999.99');
            consoleSpy.mockRestore();
        });
    });
    
    // ========================================
    // Business Rules Validation Tests
    // ========================================
    
    describe('Business Rules Validation', () => {
        
        test('TC-022: Verify insufficient funds protection (CRITICAL)', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(100.00);
            
            const mockRl = createMockReadline(['100.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(100.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });
        
        test('TC-023: Verify balance persistence within session', async () => {
            const dataProgram = new DataProgram();
            const mockRl1 = createMockReadline(['500']);
            const mockRl2 = createMockReadline(['200']);
            
            const ops1 = new Operations(dataProgram, mockRl1);
            const ops2 = new Operations(dataProgram, mockRl2);
            
            // Credit $500
            await ops1.creditAccount();
            expect(dataProgram.read()).toBe(1500.00);
            
            // Debit $200
            await ops2.debitAccount();
            expect(dataProgram.read()).toBe(1300.00);
        });
        
        test('TC-024: Verify balance reset on new DataProgram instance', () => {
            const dataProgram1 = new DataProgram();
            dataProgram1.write(5000.00);
            
            // Simulate application restart - new instance
            const dataProgram2 = new DataProgram();
            
            expect(dataProgram2.read()).toBe(1000.00); // Reset to initial
        });
        
        test('TC-025: Verify maximum balance limit', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(999000.00);
            
            const mockRl = createMockReadline(['999.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(999999.99);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 999999.99');
            consoleSpy.mockRestore();
        });
        
        test('TC-026: Verify precision to 2 decimal places', async () => {
            const dataProgram = new DataProgram();
            const mockRl1 = createMockReadline(['0.01']);
            const mockRl2 = createMockReadline(['0.01']);
            
            const ops1 = new Operations(dataProgram, mockRl1);
            const ops2 = new Operations(dataProgram, mockRl2);
            
            // Credit $0.01
            await ops1.creditAccount();
            expect(dataProgram.read()).toBe(1000.01);
            
            // Debit $0.01
            await ops2.debitAccount();
            expect(dataProgram.read()).toBe(1000.00); // Back to original
        });
    });
    
    // ========================================
    // Edge Cases & Boundaries Tests
    // ========================================
    
    describe('Edge Cases & Boundaries', () => {
        
        test('TC-027: Maximum single credit amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['998999.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(999999.99);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 999999.99');
            consoleSpy.mockRestore();
        });
        
        test('TC-028: Credit causing balance overflow protection', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(999000.00);
            
            const mockRl = createMockReadline(['2000.00']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            // Should reject transaction that exceeds max balance
            expect(dataProgram.read()).toBe(999000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Transaction would exceed maximum balance limit of $999,999.99');
            consoleSpy.mockRestore();
        });
        
        test('TC-029: Debit amount equals balance exactly', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(1234.56);
            
            const mockRl = createMockReadline(['1234.56']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
            consoleSpy.mockRestore();
        });
        
        test('TC-030: Debit amount one cent more than balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(1234.56);
            
            const mockRl = createMockReadline(['1234.57']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1234.56); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });
        
        test('TC-031: Zero amount credit handling', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['0']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            // Should reject zero or negative amounts
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('TC-032: Zero amount debit handling', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['0']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            // Should reject zero or negative amounts
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('Negative amount credit handling', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['-100']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('Negative amount debit handling', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['-100']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('Non-numeric input handling for credit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['abc']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('Non-numeric input handling for debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['xyz']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
            consoleSpy.mockRestore();
        });
        
        test('Amount exceeding transaction limit for credit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['1000000.00']); // Exceeds max
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.creditAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Amount exceeds maximum transaction limit of $999,999.99');
            consoleSpy.mockRestore();
        });
        
        test('Amount exceeding transaction limit for debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline(['1000000.00']); // Exceeds max
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Amount exceeds maximum transaction limit of $999,999.99');
            consoleSpy.mockRestore();
        });
    });
    
    // ========================================
    // DataProgram Unit Tests
    // ========================================
    
    describe('DataProgram - Data Layer Tests', () => {
        
        test('Read operation returns current balance', () => {
            const dataProgram = new DataProgram();
            expect(dataProgram.read()).toBe(1000.00);
        });
        
        test('Write operation updates stored balance', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(2500.00);
            expect(dataProgram.read()).toBe(2500.00);
        });
        
        test('Multiple read operations return consistent value', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(1500.00);
            
            expect(dataProgram.read()).toBe(1500.00);
            expect(dataProgram.read()).toBe(1500.00);
            expect(dataProgram.read()).toBe(1500.00);
        });
        
        test('Write operation overwrites previous balance', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(500.00);
            expect(dataProgram.read()).toBe(500.00);
            
            dataProgram.write(750.00);
            expect(dataProgram.read()).toBe(750.00);
        });
    });
    
    // ========================================
    // Integration Tests
    // ========================================
    
    describe('Integration Tests - Complete Workflows', () => {
        
        test('Complete transaction workflow: View, Credit, Debit, View', async () => {
            const dataProgram = new DataProgram();
            
            // Initial view
            const mockRl1 = createMockReadline();
            const ops1 = new Operations(dataProgram, mockRl1);
            await ops1.viewBalance();
            expect(dataProgram.read()).toBe(1000.00);
            
            // Credit $100
            const mockRl2 = createMockReadline(['100']);
            const ops2 = new Operations(dataProgram, mockRl2);
            await ops2.creditAccount();
            expect(dataProgram.read()).toBe(1100.00);
            
            // Debit $50
            const mockRl3 = createMockReadline(['50']);
            const ops3 = new Operations(dataProgram, mockRl3);
            await ops3.debitAccount();
            expect(dataProgram.read()).toBe(1050.00);
            
            // Final view
            const mockRl4 = createMockReadline();
            const ops4 = new Operations(dataProgram, mockRl4);
            await ops4.viewBalance();
            expect(dataProgram.read()).toBe(1050.00);
        });
        
        test('Mixed successful and failed transactions', async () => {
            const dataProgram = new DataProgram();
            
            // Credit $500
            const mockRl1 = createMockReadline(['500']);
            const ops1 = new Operations(dataProgram, mockRl1);
            await ops1.creditAccount();
            expect(dataProgram.read()).toBe(1500.00);
            
            // Debit $2000 (should fail)
            const mockRl2 = createMockReadline(['2000']);
            const ops2 = new Operations(dataProgram, mockRl2);
            const consoleSpy = jest.spyOn(console, 'log');
            await ops2.debitAccount();
            expect(dataProgram.read()).toBe(1500.00); // Unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            // Debit $500 (should succeed)
            const mockRl3 = createMockReadline(['500']);
            const ops3 = new Operations(dataProgram, mockRl3);
            await ops3.debitAccount();
            expect(dataProgram.read()).toBe(1000.00);
            
            consoleSpy.mockRestore();
        });
    });
});
