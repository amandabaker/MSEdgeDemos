// Component for copying the contents of the manifest to the clipboard
import { copyManifest, updateManifest } from "../../state.js";

// Create the template
const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />  
    <styled-button id="copy-button" type="secondary" size="sm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="15" width="15"><rect width="256" height="256" fill="none"/><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="40" y="88" width="128" height="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
      copy
    </styled-button>
    `;

class CopyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const button = this.shadowRoot.querySelector("#copy-button");
    button.addEventListener("click", () => {
      updateManifest();
      copyManifest();
    });
  }
}

// Define the new element
customElements.define("copy-button", CopyButton);
