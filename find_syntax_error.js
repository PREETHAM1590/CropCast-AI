// Find syntax error in app.js
const fs = require('fs');

try {
    const code = fs.readFileSync('frontend/js/app.js', 'utf8');
    const lines = code.split('\n');
    
    console.log('🔍 Checking JavaScript syntax...');
    console.log('📄 Total lines:', lines.length);
    
    // Try to parse line by line to find the error
    let cumulativeCode = '';
    
    for (let i = 0; i < lines.length; i++) {
        cumulativeCode += lines[i] + '\n';
        
        try {
            // Try to parse up to this line
            new Function(cumulativeCode);
        } catch (error) {
            console.error(`❌ Syntax error at line ${i + 1}:`);
            console.error(`📝 Line content: "${lines[i]}"`);
            console.error(`🔍 Error: ${error.message}`);
            
            // Show context (previous and next lines)
            console.log('\n📋 Context:');
            for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) {
                const marker = j === i ? '>>> ' : '    ';
                console.log(`${marker}${j + 1}: ${lines[j]}`);
            }
            
            process.exit(1);
        }
    }
    
    console.log('✅ No syntax errors found!');
    
} catch (error) {
    console.error('❌ Error reading file:', error.message);
    process.exit(1);
}
