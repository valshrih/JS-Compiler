const BOILERPLATE = {
    javascript: `// Serverless JavaScript Environment\nconst framework = "Vanilla JS";\nconsole.log("Hello from " + framework + "!");\n\nvar legacyVariable = "change me to let/const to pass ESLint";\nif(1 == "1") {\n  console.log("Lint check will catch this double-equals usage.");\n}`,
    python: `# Running locally via WebAssembly!\nimport sys\nprint("Hello from Python WASM v" + sys.version.split()[0])\n\nfor i in range(3):\n    print(f"Loop block step: {i}")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World from simulated browser JDK layer!");\n    }\n}`,
    go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World from simulated Go browser runtime!")\n}`
};

const languageSelect = document.getElementById('languageSelect');
const codeEditor = document.getElementById('codeEditor');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const formatBtn = document.getElementById('formatBtn');
const lintBtn = document.getElementById('lintBtn');
const outputBox = document.getElementById('outputBox');
const statusMessage = document.getElementById('statusMessage');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.querySelector('.status-text');

let pyodideInstance = null;

// Initialize Workspace Default UI State
languageSelect.value = 'javascript';
codeEditor.value = BOILERPLATE.javascript;
updateStatus("JavaScript engine ready. Downloading Python WASM layer in the background...", "#f1c40f");

// Lazy-load Python WebAssembly binaries globally inside browser cache
async function loadPythonWasmEngine() {
    try {
        pyodideInstance = await loadPyodide();
        if (languageSelect.value === 'javascript') {
            updateStatus("Workspace optimized. Core execution compilers online.", "#23a96e");
        }
    } catch (err) {
        console.error("WASM background allocation mismatch:", err);
    }
}
loadPythonWasmEngine();

languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    codeEditor.value = BOILERPLATE[lang];
    
    // Dynamically update the visual panel filename indicator for style consistency
    document.querySelector('.panel-title').textContent = 
        lang === 'javascript' ? 'main.js' : lang === 'python' ? 'main.py' : lang === 'java' ? 'Main.java' : 'main.go';

    if (lang === 'python' && !pyodideInstance) {
        updateStatus("Mounting sandbox virtual architecture inside application layers...", "#f1c40f");
    } else {
        updateStatus(`Environment runtime configured to context: ${lang}.`, "#007acc");
    }
});

clearBtn.addEventListener('click', () => {
    outputBox.textContent = "";
    codeEditor.value="";
    outputBox.style.color = '#a3be8c';
    updateStatus("Console output streams cleared successfully.", "#888894");
});

// Client-Side Prettier Formatting Rules Engine Simulation
formatBtn.addEventListener('click', () => {
    let rawCode = codeEditor.value;
    
    // Split code into individual lines
    let lines = rawCode.split('\n');
    let formattedLines = [];
    let indentLevel = 0;
    const indentString = '    '; // 4 spaces for tabs

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // If the line is completely blank, keep maximum of one empty spacing block safely
        if (line === '') {
            if (formattedLines[formattedLines.length - 1] !== '') {
                formattedLines.push('');
            }
            continue;
        }

        // 1. Decrement indent level immediately if the line starts with a closing brace
        if (line.startsWith('}') || line.startsWith(']')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // 2. Format internal syntax rules (add spaces after commas, handle clean operator spacing)
        let formattedLine = line
            .replace(/,(\S)/g, ', $1')                     // Space after commas
            .replace(/\s*([\=\+\-\*\/><\?:]+)\s*/g, ' $1 ') // Balanced space around operators
            .replace(/\s*;\s*$/, ';');                      // Remove trailing spaces before semicolons

        // Fix potential double-spacing bugs from general operator regex replacement (like === or >=)
        formattedLine = formattedLine
            .replace(/=\s+=\s+=/g, '===')
            .replace(/!\s+=\s+=/g, '!==')
            .replace(/=\s+=/g, '==')
            .replace(/<\s+=/g, '<=')
            .replace(/>\s+=/g, '>=')
            .replace(/\+\s+=/g, '+=')
            .replace(/-\s+=/g, '-=');

        // 3. Apply the current calculated indentation level to the start of the line
        if (formattedLine !== '') {
            formattedLine = indentString.repeat(indentLevel) + formattedLine;
        }

        formattedLines.push(formattedLine);

        // 4. Increment indentation level for the next line if this line ends with an opening brace
        if (line.endsWith('{') || line.endsWith('[')) {
            indentLevel++;
        }
    }

    // Join lines back together, trimming leading/trailing empty lines out of code viewport entirely
    codeEditor.value = formattedLines.join('\n').trim();
    updateStatus("✨ Prettier Layer: Layout syntax aligned with smart multi-level indentation.", "#23a96e");
});

// Client-Side ESLint Lint Compiler Simulation
lintBtn.addEventListener('click', () => {
    const code = codeEditor.value;
    let feedback = [];

    if (languageSelect.value === 'javascript') {
        if (code.includes('var ')) {
            feedback.push("⚠️ [no-var] Prefer declaring variables via 'let' or 'const'.");
        }
        if (/\s+==\s+/.test(code) && !/\s+===\s+/.test(code)) {
            feedback.push("⚠️ [eqeqeq] Use Strict Equality Operators '==='.");
        }
    } else {
        feedback.push("ESLint metrics are scoped exclusively to evaluate JavaScript runtimes.");
    }

    if (feedback.length > 0) {
        statusText.innerHTML = feedback.join(" | ");
        statusIndicator.style.background = "var(--accent-red)";
        statusMessage.style.borderLeftColor = "var(--accent-red)";
    } else {
        updateStatus("🔍 ESLint Validation: 0 style errors found! Code quality verified.", "#23a96e");
    }
});

// Primary Compiler Core Execution Engine Router
runBtn.addEventListener('click', async () => {
    const language = languageSelect.value;
    const code = codeEditor.value;

    outputBox.textContent = "Processing logic layers...";
    outputBox.style.color = '#f1c40f';

    if (language === 'javascript') {
        runJavaScriptClientSide(code);
    } else if (language === 'python') {
        runPythonClientSide(code);
    } else if (language === 'java') {
        runJavaClientSide(code);
    } else if (language === 'go') {
        runGoClientSide(code);
    }
});

function runJavaScriptClientSide(code) {
    let capturedLogs = [];
    const originalLog = console.log;
    console.log = (...args) => {
        capturedLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    };

    try {
        new Function(code)();
        outputBox.textContent = capturedLogs.join('\n') || "Process executed successfully with no printable terminal parameters returns.";
        outputBox.style.color = '#a3be8c';
      
    } catch (err) {
        outputBox.textContent = `Uncaught Runtime Exception:\n${err.message}`;
        outputBox.style.color = 'var(--accent-red)';
    } finally {
        console.log = originalLog;
    }
}

async function runPythonClientSide(code) {
    if (!pyodideInstance) {
        outputBox.textContent = "Compiling python WASM environment. Please standby...";
        return;
    }
    let logs = "";
    pyodideInstance.setStdout({ batched: (str) => { logs += str + "\n"; } });
    pyodideInstance.setStderr({ batched: (str) => { logs += "[RUNTIME ERROR] " + str + "\n"; } });

    try {
        await pyodideInstance.runPythonAsync(code);
        outputBox.textContent = logs || "Execution completed with no return registers.";
        outputBox.style.color = '#a3be8c';
    } catch (err) {
        outputBox.textContent = err.message;
        outputBox.style.color = 'var(--accent-red)';
    }
}

function runJavaClientSide(code) {
    try {
        if (!code.includes("System.out.println")) {
            outputBox.textContent = "Build Successful.";
            outputBox.style.color = '#a3be8c';
            return;
        }
        const matches = [...code.matchAll(/System\.out\.println\s*\(\s*"(.*?)"\s*\)\s*;/g)];
        if (matches.length > 0) {
            outputBox.textContent = matches.map(m => m[1]).join('\n');
            outputBox.style.color = '#a3be8c';
        } else {
            throw new Error("Syntax Error matching Java output stream tokens.");
        }
    } catch (err) {
        outputBox.textContent = err.message;
        outputBox.style.color = 'var(--accent-red)';
    }
}

function runGoClientSide(code) {
    try {
        if (!code.includes("fmt.Println")) {
            outputBox.textContent = "Process compiled with exit code 0.";
            outputBox.style.color = '#a3be8c';
            return;
        }
        const matches = [...code.matchAll(/fmt\.Println\s*\(\s*"(.*?)"\s*\)/g)];
        if (matches.length > 0) {
            outputBox.textContent = matches.map(m => m[1]).join('\n');
            outputBox.style.color = '#a3be8c';
        } else {
            throw new Error("panic: runtime error: invalid format macro sequences");
        }
    } catch (err) {
        outputBox.textContent = err.message;
        outputBox.style.color = 'var(--accent-red)';
    }
}

function updateStatus(text, color) {
    statusText.textContent = text;
    statusIndicator.style.background = color;
    statusMessage.style.borderLeftColor = color;
}