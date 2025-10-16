/**
 * Interactive Calculator
 * A fully functional calculator with dark/light theme, keyboard support,
 * and comprehensive error handling.
 */

class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
        this.maxInputLength = 15;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateDisplay();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.themeToggle = document.getElementById('theme-toggle');
        this.buttons = document.querySelectorAll('button');
    }

    /**
     * Set up all event listeners
     */
    initializeEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('change', () => this.toggleTheme());

        // Button clicks
        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button));
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => this.handleKeyboardInput(event));
    }

    /**
     * Handle button click events
     */
    handleButtonClick(button) {
        this.animateButton(button);
        
        if (button.dataset.number) {
            this.handleNumber(button.dataset.number);
        } else if (button.dataset.operation) {
            this.handleOperation(button.dataset.operation);
        } else if (button.dataset.action === 'calculate') {
            this.calculate();
        } else if (button.dataset.action === 'clear') {
            this.clear();
        } else if (button.dataset.action === 'delete') {
            this.delete();
        }
        
        this.updateDisplay();
    }

    /**
     * Handle keyboard input
     */
    handleKeyboardInput(event) {
        event.preventDefault();
        
        const key = event.key;
        
        // Find and animate the corresponding button
        let buttonToAnimate = null;
        
        if (key >= '0' && key <= '9') {
            buttonToAnimate = document.querySelector(`button[data-number="${key}"]`);
            this.handleNumber(key);
        } else if (key === '.') {
            buttonToAnimate = document.querySelector('button[data-operation="."]');
            this.handleOperation('.');
        } else if (key === '+' || key === '-') {
            buttonToAnimate = document.querySelector(`button[data-operation="${key}"]`);
            this.handleOperation(key);
        } else if (key === '*') {
            buttonToAnimate = document.querySelector('button[data-operation="*"]');
            this.handleOperation('*');
        } else if (key === '/') {
            buttonToAnimate = document.querySelector('button[data-operation="÷"]');
            this.handleOperation('÷');
        } else if (key === 'Enter' || key === '=') {
            buttonToAnimate = document.querySelector('button[data-action="calculate"]');
            this.calculate();
        } else if (key === 'Escape' || key === 'Delete') {
            buttonToAnimate = document.querySelector('button[data-action="clear"]');
            this.clear();
        } else if (key === 'Backspace') {
            buttonToAnimate = document.querySelector('button[data-action="delete"]');
            this.delete();
        }
        
        if (buttonToAnimate) {
            this.animateButton(buttonToAnimate);
        }
        
        this.updateDisplay();
    }

    /**
     * Add number to current operand
     */
    handleNumber(number) {
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        
        // Prevent multiple zeros at start
        if (this.currentOperand === '0' && number === '0') return;
        
        // Replace initial zero with new number
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
            return;
        }
        
        // Check input length limit
        if (this.currentOperand.length >= this.maxInputLength) {
            this.showError('Input too long');
            return;
        }
        
        this.currentOperand += number;
    }

    /**
     * Handle operation selection
     */
    handleOperation(op) {
        if (op === '.') {
            // Handle decimal point
            if (this.resetScreen) {
                this.currentOperand = '0';
                this.resetScreen = false;
            }
            
            if (!this.currentOperand.includes('.')) {
                this.currentOperand += '.';
            }
            return;
        }
        
        if (this.currentOperand === '' && this.previousOperand === '') return;
        
        // If there's a previous operation, calculate it first
        if (this.previousOperand !== '' && this.operation && !this.resetScreen) {
            this.calculate();
        }
        
        this.operation = op;
        this.previousOperand = this.currentOperand;
        this.resetScreen = true;
    }

    /**
     * Perform calculation
     */
    calculate() {
        if (this.operation == null || this.resetScreen) return;
        
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let computation;
        let operationSymbol = '';
        
        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    operationSymbol = '+';
                    break;
                case '-':
                    computation = prev - current;
                    operationSymbol = '-';
                    break;
                case '*':
                    computation = prev * current;
                    operationSymbol = '×';
                    break;
                case '÷':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    computation = prev / current;
                    operationSymbol = '÷';
                    break;
                default:
                    return;
            }
            
            // Handle very large/small numbers
            if (!isFinite(computation)) {
                throw new Error('Number too large');
            }
            
            // Round to avoid floating point precision issues
            computation = Math.round(computation * 100000000) / 100000000;
            
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.resetScreen = true;
            
        } catch (error) {
            this.handleCalculationError(error.message);
        }
    }

    /**
     * Handle calculation errors
     */
    handleCalculationError(errorMessage) {
        let userMessage;
        
        switch (errorMessage) {
            case 'Division by zero':
                userMessage = 'Cannot divide by zero';
                break;
            case 'Number too large':
                userMessage = 'Number too large';
                break;
            default:
                userMessage = 'Calculation error';
        }
        
        this.showError(userMessage);
        this.clear();
    }

    /**
     * Show error message
     */
    showError(message) {
        this.currentOperandElement.textContent = message;
        this.currentOperandElement.classList.add('display-error');
        
        setTimeout(() => {
            this.currentOperandElement.classList.remove('display-error');
            this.updateDisplay();
        }, 2000);
    }

    /**
     * Clear calculator
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
    }

    /**
     * Delete last character
     */
    delete() {
        if (this.resetScreen) return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    /**
     * Update display with current values
     */
    updateDisplay() {
        // Add animation
        this.currentOperandElement.classList.add('display-update');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('display-update');
        }, 200);
        
        this.currentOperandElement.textContent = this.formatDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.textContent = `${this.formatDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand ? this.formatDisplayNumber(this.previousOperand) : '';
        }
        
        // Update ARIA labels for screen readers
        this.currentOperandElement.setAttribute('aria-label', `Current input: ${this.currentOperand}`);
        let previousText = this.previousOperand ? `Previous operation: ${this.previousOperand} ${this.getOperationSymbol(this.operation) || ''}` : 'No previous operation';
        this.previousOperandElement.setAttribute('aria-label', previousText);
    }

    /**
     * Format number for display (add commas for large numbers)
     */
    formatDisplayNumber(number) {
        if (number === '') return '';
        
        const [integerPart, decimalPart] = number.split('.');
        
        // Handle very large numbers
        if (integerPart.length > 12) {
            return Number(number).toExponential(6);
        }
        
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        return decimalPart != null ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    }

    /**
     * Get display symbol for operation
     */
    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '÷': '÷'
        };
        return symbols[operation] || operation;
    }

    /**
     * Animate button press
     */
    animateButton(button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 100);
    }

    /**
     * Initialize theme from localStorage
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('calculator-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            this.themeToggle.checked = false;
        }
    }

    /**
     * Toggle between dark and light themes
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDarkMode = document.body.classList.contains('dark-theme');
        localStorage.setItem('calculator-theme', isDarkMode ? 'dark' : 'light');
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});