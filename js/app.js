/**
 * Set the code of the prompt text code view element.
 * @param {String} code 
 */
function setPromptText(code) {
    // create code block as pre to keep whitespace
    const el = document.getElementById("code_prompt");

    // clear out anything that could still be in the code prompt element
    el.innerHTML = "";

    // add code mirror className so syntax highlighting works
    el.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(code, { name: "javascript" }, el);
}

/**
 * Initialize the UI components.
 */
(function init() {
    const code = "'Test'";

    setPromptText(code);
})();