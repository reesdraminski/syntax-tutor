// create a CodeMirror editor that will be used by the user to make syntax corrections
const editor = CodeMirror(document.getElementById("editor"), {
    mode: { name: "javascript" },
    lineNumbers: true,
    indentWithTabs: true,
    indentUnit: 4,
    lineWrapping: true
});

// initialize the prompt UI
let promptText = generateProblem();
setPrompt(promptText);

/**
 * Set the contents of the code prompt view to formatted code text.
 * @param {String} code 
 */
function setPrompt(code) {
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
 * Get random string of text.
 * @returns {String} text
 */
function getRandomText() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

/**
* Generate a code example to display to the user as a syntax problem.
* @returns {String} problemText
*/
function generateProblem() {
    const problemTypes = ["forLoop", "stringQuoteMismatch", "closureMismatch", "equalityOperator"];

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
    else if (problemType == "stringQuoteMismatch") {
        const firstQuote  = Math.round(Math.random()) ? "\"" : "'";
        const secondQuote = Math.round(Math.random()) ? "\"" : "'";
        const text = getRandomText();

        problemText = `${firstQuote}${text}${secondQuote}`;
    }
    else if (problemType == "closureMismatch") {
        const openings = ["{", "(", "["];
        const closings = ["}", ")", "]"];

        const variants = [
            `if ${selectRandom(openings)}true${selectRandom(closings)} {\n\tconsole.log("${getRandomText()}");\n}`,
            `function() ${selectRandom(openings)}\n\tconsole.log("${getRandomText()}");\n${selectRandom(closings)}`,
            `let arr = ${selectRandom(["{", "["])}1, 2, 3, 4, 5${selectRandom(["}", "]"])}`
        ];

        problemText = selectRandom(variants);
    }
    else if (problemType == "equalityOperator") {
        const operator = Math.round(Math.random()) ? "=" : "==";

        problemText = `if (1 ${operator} 2) {\n\tconsole.log("${getRandomText()}");\n}`;
    }

    return problemText;
}

/**
 * Check the user's answer.
 * @param {String} response 
 */
function answerPrompt(response) {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // if the code syntax is correct
    if (checkCode(promptText)) {
        if (response == "correct") {
            // give the user feedback that they're right
            notif.innerHTML = "That's right!";
            notif.className = "success";

            // generate a new problem
            promptText = generateProblem();
            setPrompt(promptText);
        }
        else {
            // give the user feedback that they're wrong
            notif.innerHTML = "That's wrong.";
            notif.className = "failure";
        }
    }
    // if the problem syntax is incorrect
    else {
        if (response == "correct") {
            // give the user feedback that they're wrong
            notif.innerHTML = "That's wrong.";
            notif.className = "failure";
        }
        else {
            // give the user feedback that they're right
            notif.innerHTML = "That's right!";
            notif.className = "success";

            // show the editor to allow the user to correct the syntax
            // TODO should the editor auto-populate or does that take away typing practice?
            document.getElementById("makeCorrections").style.display = "";
            editor.refresh();
            editor.focus();
        }
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
}

/**
 * Correct the syntax of the prompt
 */
function correctPrompt() {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // if the user types in syntatically correct code
    // TODO this is just checks if it is syntactically correct, not that it is the right code
    if (checkCode(editor.getValue())) {
        // give the user feedback that they're right
        notif.innerHTML = "That's right!";
        notif.className = "success";

        // hide the make corrections div since we're done correcting
        document.getElementById("makeCorrections").style.display = "none";

        // generate a new problem
        promptText = generateProblem();
        setPrompt(promptText);
    }
    else {
        // give the user feedback that they're wrong
        notif.innerHTML = "That's wrong.";
        notif.className = "failure";
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
}

// bind onclick functions to the buttons
document.getElementById("correct").onclick = () => answerPrompt("correct");
document.getElementById("incorrect").onclick = () => answerPrompt("incorrect");
document.getElementById("submit").onclick = correctPrompt;