const runBtn = document.getElementById('run-btn');
const formatBtn = document.getElementById('format-btn');
const outputBox = document.getElementById('output-box');

const initialCode = `// 1. ESLint highlights linting errors instantly
const greeting = "Hello World!";
let unusedVar = 42; 

console.log(greeting);

// 2. Try typing 'window.' below to trigger autocomplete sense
`;

// Initialize global window dependency engines
const eslintInstance = new window.eslint.Linter();

// ESLint verification parameters
const eslintConfig = {
    parserOptions: { ecmaVersion: 2021, sourceType: "script" },
    rules: {
        "no-undef": "error",
        "no-unused-vars": "warn",
        "eqeqeq": "warn"
    },
    env: { es6: true, browser: true }
};

// Bridge linking ESLint array findings with CodeMirror's UI engine
CodeMirror.registerHelper("lint", "javascript", function(text) {
    const messages = eslintInstance.verify(text, eslintConfig);
    const found = [];
    
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const startLine = msg.line - 1;
        const startCh = msg.column - 1;
        const endLine = msg.endLine ? msg.endLine - 1 : startLine;
        const endCh = msg.endColumn ? msg.endColumn - 1 : startCh + 1;

        found.push({
            from: CodeMirror.Pos(startLine, startCh),
            to: CodeMirror.Pos(endLine, endCh),
            message: `${msg.message} (${msg.ruleId})`,
            severity: msg.severity === 2 ? "error" : "warning"
        });
    }
    return found;
});

// Convert the basic textarea layout asset into an active, robust workspace instance
const editor = CodeMirror.fromTextArea(document.getElementById('editor-container'), {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    gutters: ["CodeMirror-lint-markers"],
    lint: true, // Connects real-time lint verification rules
    extraKeys: { "Ctrl-Space": "autocomplete" } // Fallback option manual bypass trigger
});

// Push startup code values directly inside input view boundaries
editor.setValue(initialCode);

// // Code Sense Engine: Hook into the input stream to display contextual recommendations automatically
// editor.on("inputRead", function(cm, change) {
//     // Only trigger hints for alphabetical characters or dots (like console.)
//     if (change.text[0].match(/[a-zA-Z.]/)) {
//         cm.showHint({ hint: CodeMirror.hint.javascript, completeOnSingleClick: false });
//     }
// });
// Code Sense Engine: Hook into the input stream to display contextual recommendations
editor.on("inputRead", function(cm, change) {
    // Only trigger hints for alphabetical characters or dots (like console.)
    if (change.text[0].match(/[a-zA-Z.]/)) {
        cm.showHint({ 
            hint: CodeMirror.hint.javascript, 
            completeOnSingleClick: false,
            // FIX: Forces the autocomplete dropdown to render INSIDE the editor's DOM container
            container: cm.getWrapperElement() 
        });
    }
});

// Run Prettier formatting engine directly in the browser wrapper space
formatBtn.addEventListener('click', () => {
    const currentCode = editor.getValue();
    try {
        const formattedCode = prettier.format(currentCode, {
            parser: "babel",
            plugins: prettierPlugins,
            semi: true,
            singleQuote: false
        });
        editor.setValue(formattedCode);
    } catch (err) {
        outputBox.textContent = `Prettier Formatting Error:\n${err.message}`;
        outputBox.style.color = "#ff6b6b";
    }
});

// Intercept window thread logging safely
runBtn.addEventListener('click', () => {
    const code = editor.getValue();
    let logs = [];
    outputBox.style.color = "#a9b7c6";

    const originalLog = console.log;
    console.log = function(...args) {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' '));
        originalLog.apply(console, args);
    };

    try {
        new Function(code)();
        outputBox.textContent = logs.length > 0 ? logs.join('\n') : "Code executed successfully with no returned output.";
    } catch (error) {
        outputBox.textContent = `Runtime Error:\n${error.message}`;
        outputBox.style.color = "#ff6b6b";
    } finally {
        console.log = originalLog;
    }
});