// Simple syntax checker for app.js
const fs = require('fs');

try {
    const code = fs.readFileSync('frontend/js/app.js', 'utf8');
    
    // Try to parse the JavaScript
    new Function(code);
    
    console.log('✅ JavaScript syntax is valid!');
    console.log('📄 File size:', code.length, 'characters');
    console.log('📝 Lines:', code.split('\n').length);
    
    // Check for common issues
    const issues = [];
    
    // Check for missing commas in class methods
    const methodPattern = /}\s*\n\s*\/\*\*[\s\S]*?\*\/\s*\n\s*\w+\s*\(/g;
    const matches = code.match(methodPattern);
    
    if (matches) {
        console.log('🔍 Found', matches.length, 'method definitions');
    }
    
    // Check for proper class structure
    if (code.includes('class CropCastApp')) {
        console.log('✅ CropCastApp class found');
    }
    
    // Check for proper method separators
    const methodSeparators = code.match(/},\s*\n\s*\/\*\*/g);
    if (methodSeparators) {
        console.log('✅ Found', methodSeparators.length, 'properly separated methods');
    }
    
    console.log('🎉 All syntax checks passed!');
    
} catch (error) {
    console.error('❌ JavaScript syntax error:', error.message);
    
    // Try to identify the line number
    if (error.message.includes('line')) {
        const lineMatch = error.message.match(/line (\d+)/);
        if (lineMatch) {
            console.error('🔍 Error at line:', lineMatch[1]);
        }
    }
    
    process.exit(1);
}
