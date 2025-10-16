        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const previousOperandElement = document.querySelector('.previous-operand');
            const currentOperandElement = document.querySelector('.current-operand');
            const themeToggle = document.getElementById('theme-toggle');
            const buttons = document.querySelectorAll('button');
            
            // Calculator state
            let currentOperand = '0';
            let previousOperand = '';
            let operation = undefined;
            let resetScreen = false;
            
            // Theme management
            function initializeTheme() {
                const savedTheme = localStorage.getItem('calculator-theme');
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-theme');
                    themeToggle.checked = true;
                } else {
                    document.body.classList.remove('dark-theme');
                    themeToggle.checked = false;
                }
            }
            
            function toggleTheme() {
                document.body.classList.toggle('dark-theme');
                const isDarkMode = document.body.classList.contains('dark-theme');
                localStorage.setItem('calculator-theme', isDarkMode ? 'dark' : 'light');
            }
            
            // Calculator functions
            function clear() {
                currentOperand = '0';
                previousOperand = '';
                operation = undefined;
            }
            
            function deleteNumber() {
                if (currentOperand.length === 1) {
                    currentOperand = '0';
                } else {
                    currentOperand = currentOperand.slice(0, -1);
                }
            }
            
            function appendNumber(number) {
                if (resetScreen) {
                    currentOperand = '';
                    resetScreen = false;
                }
                
                if (number === '.' && currentOperand.includes('.')) return;
                
                if (currentOperand === '0' && number !== '.') {
                    currentOperand = number;
                } else {
                    currentOperand += number;
                }
            }
            
            function chooseOperation(op) {
                if (currentOperand === '') return;
                
                if (previousOperand !== '') {
                    calculate();
                }
                
                operation = op;
                previousOperand = currentOperand;
                resetScreen = true;
            }
            
            function calculate() {
                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            alert("Cannot divide by zero!");
                            clear();
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                currentOperand = computation.toString();
                operation = undefined;
                previousOperand = '';
            }
            
            function updateDisplay() {
                currentOperandElement.textContent = currentOperand;
                
                if (operation != null) {
                    previousOperandElement.textContent = `${previousOperand} ${operation}`;
                } else {
                    previousOperandElement.textContent = previousOperand;
                }
            }
            
            // Event Listeners
            themeToggle.addEventListener('change', toggleTheme);
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.dataset.number) {
                        appendNumber(button.dataset.number);
                        updateDisplay();
                    } else if (button.dataset.operation) {
                        chooseOperation(button.dataset.operation);
                        updateDisplay();
                    } else if (button.dataset.action === 'calculate') {
                        calculate();
                        updateDisplay();
                    } else if (button.dataset.action === 'clear') {
                        clear();
                        updateDisplay();
                    } else if (button.dataset.action === 'delete') {
                        deleteNumber();
                        updateDisplay();
                    }
                });
            });
            
            // Keyboard support
            document.addEventListener('keydown', event => {
                if (event.key >= '0' && event.key <= '9') {
                    appendNumber(event.key);
                    updateDisplay();
                } else if (event.key === '.') {
                    appendNumber('.');
                    updateDisplay();
                } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                    chooseOperation(event.key === '/' ? '÷' : event.key);
                    updateDisplay();
                } else if (event.key === 'Enter' || event.key === '=') {
                    event.preventDefault();
                    calculate();
                    updateDisplay();
                } else if (event.key === 'Escape' || event.key === 'Delete') {
                    clear();
                    updateDisplay();
                } else if (event.key === 'Backspace') {
                    deleteNumber();
                    updateDisplay();
                }
            });
            
            // Initialize
            initializeTheme();
            updateDisplay();
        });