const editor = CodeMirror(document.getElementById("editor"), {
    mode: { name: "javascript" },
    lineNumbers: true,
    indentWithTabs: true,
    indentUnit: 4,
    lineWrapping: true
});

/**
 * Set the contents of the code prompt view to formatted code text.
 * @param {String} code 
 */
function setPromptCode(code) {
    const exampleEl = document.getElementById("example");

    // clear out anything that could still be in the code prompt element
    exampleEl.innerHTML = "";

    // add code mirror className so syntax highlighting works
    exampleEl.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(code, { name: "javascript" }, example);
}

/**
 * Select and return a random element from an array.
 * @param {Array} arr
 * @returns {Any} element
 */
function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Checkd the code to see if it has valid syntax.
 * @param {String} code 
 * @returns {Boolean} isValidSyntax
 */
function checkCode(code) {
    try {
        esprima.parse(code);
    } 
    catch(e) {
        return false;
    }
    
    return true;
}

/**
 * Check the user's answer.
 * @param {String} promptText 
 * @param {String} response 
 */
function answerPrompt(promptText, response) {
    // if the code syntax is correct
    if (checkCode(promptText)) {
        if (response == "correct") {
            console.log("You right.");
        }
        else {
            console.log("You wrong.");
        }
    }
    // if the problem syntax is incorrect
    else {
        if (response == "correct") {
            console.log("You wrong.");
        }
        else {
            document.getElementById("editor").style.display = "";
            editor.refresh();
        }
    }
}

/**
 * Generate a code example to display to the user as a syntax problem.
 * @returns {String} problemText
 */
function generateProblem() {
    const problemTypes = ["forLoop", "stringClosure"];

    let problemType = selectRandom(problemTypes);
    let problemText;

    if (problemType == "forLoop") {
        const variants = ["missingFirstSemi", "missingSecondSemi", "correct"];
        let variant = selectRandom(variants);

        if (variant == "missingFirstSemi") {
            problemText = "for (let x = 0 x < 5; x++) {\n\n}";
        }
        else if (variant == "missingSecondSemi") {
            problemText = "for (let x = 0; x < 5 x++) {\n\n}";
        }
        else if (variant == "correct") {
            problemText = "for (let x = 0; x < 5; x++) {\n\n}";
        }
    }
    else if (problemType == "stringClosure") {
        const firstQuote  = Math.round(Math.random()) ? "\"" : "'";
        const secondQuote = Math.round(Math.random()) ? "\"" : "'";
        const text = Math.random().toString(36).replace(/[^a-z]+/g, '');

        problemText = `${firstQuote}${text}${secondQuote}`;
    }

    return problemText;
}

/**
 * Initialize the UI components.
 */
(function init() {
    let promptText = generateProblem();

    let state = "ANSWERING_PROMPT";

    document.getElementById("correct").onclick = () => {
        answerPrompt(promptText, "correct");
    }
    
    document.getElementById("incorrect").onclick = () => {
        answerPrompt(promptText, "incorrect");
    }

    // setExample(promptText);
    setPromptCode(promptText);
})();