document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('.btn');
    const themeBtn = document.getElementById('themeBtn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetInput = false;
    
    // Theme toggle
    themeBtn.addEventListener('click', () => {
        document.body.dataset.theme = 
            document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        themeBtn.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
    });
    
    // Button click handler
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            
            // Add animation
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
            
            if (value >= '0' && value <= '9') {
                handleNumberInput(value);
            } else if (value === '.') {
                handleDecimalInput();
            } else if (value === 'AC') {
                handleClear();
            } else if (value === '±') {
                handlePlusMinus();
            } else if (value === '%') {
                handlePercentage();
            } else if (value === '=') {
                handleEquals();
            } else {
                handleOperator(value);
            }
            
            updateDisplay();
        });
    });
    
    function handleNumberInput(number) {
        if (currentInput === '0' || resetInput) {
            currentInput = number;
            resetInput = false;
        } else {
            currentInput += number;
        }
    }
    
    function handleDecimalInput() {
        if (resetInput) {
            currentInput = '0.';
            resetInput = false;
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    
    function handleClear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        history.textContent = '';
    }
    
    function handlePlusMinus() {
        currentInput = (parseFloat(currentInput) * -1).toString();
    }
    
    function handlePercentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }
    
    function handleEquals() {
        if (!operation || resetInput) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;
        
        switch (operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': result = prev / current; break;
            case '%': result = prev % current; break;
            default: return;
        }
        
        history.textContent = `${previousInput} ${operation} ${currentInput} =`;
        currentInput = result.toString();
        operation = null;
        resetInput = true;
    }
    
    function handleOperator(op) {
        if (operation && !resetInput) {
            handleEquals();
        }
        
        previousInput = currentInput;
        operation = op;
        resetInput = true;
        history.textContent = `${previousInput} ${operation}`;
    }
    
    function updateDisplay() {
        display.textContent = currentInput;
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            const button = document.querySelector(`.btn[data-value="${key}"]`);
            button.click();
        } else if (key === '.') {
            const button = document.querySelector('.btn[data-value="."]');
            button.click();
        } else if (key === 'Enter') {
            const button = document.querySelector('.btn[data-value="="]');
            button.click();
        } else if (key === 'Escape') {
            const button = document.querySelector('.btn[data-value="AC"]');
            button.click();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            let opValue;
            if (key === '*') opValue = '×';
            else if (key === '/') opValue = '÷';
            else opValue = key;
            
            const button = document.querySelector(`.btn[data-value="${opValue}"]`);
            if (button) button.click();
        } else if (key === '%') {
            const button = document.querySelector('.btn[data-value="%"]');
            button.click();
        }
    });
});