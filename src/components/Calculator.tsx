import React, { useState } from 'react';
import { X, Divide, Minus, Plus, Equal, Delete } from 'lucide-react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumberClick = (num: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperationClick = (operation: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (currentOperation) {
      const result = calculate(previousValue, current, currentOperation);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setCurrentOperation(operation);
    setResetDisplay(true);
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (currentOperation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, currentOperation);
      setDisplay(String(result));
      setPreviousValue(null);
      setCurrentOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentOperation(null);
    setPreviousValue(null);
    setResetDisplay(false);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs">
      <div className="p-4 bg-gray-800 text-white">
        <div className="text-right text-3xl font-medium h-16 flex items-center justify-end overflow-x-auto">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-1 p-2 bg-gray-100">
        <button 
          onClick={handleClear}
          className="col-span-2 p-4 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
        >
          AC
        </button>
        <button 
          onClick={handleDelete}
          className="p-4 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
        >
          <Delete size={20} />
        </button>
        <button 
          onClick={() => handleOperationClick('/')}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
        >
          <Divide size={20} />
        </button>
        
        {[7, 8, 9].map(num => (
          <button 
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleOperationClick('*')}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
        >
          <X size={20} />
        </button>
        
        {[4, 5, 6].map(num => (
          <button 
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleOperationClick('-')}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
        >
          <Minus size={20} />
        </button>
        
        {[1, 2, 3].map(num => (
          <button 
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleOperationClick('+')}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
        
        <button 
          onClick={() => handleNumberClick('0')}
          className="col-span-2 p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          0
        </button>
        <button 
          onClick={handleDecimal}
          className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          .
        </button>
        <button 
          onClick={handleEquals}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <Equal size={20} />
        </button>
      </div>
    </div>
  );
}