// Component for copying the contents of the manifest to the clipboard
import { getManifest, updateManifest } from "../../state.js";

// Create the template
const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />  
    <style>
    .btn {
        align-self: center;
        background-color: #404040;
        padding: 5px 10px;
        border-radius: 10px;
        font-size: inherit;
        font-style: italic;
        cursor: pointer;
        display: inline-block;
    }

    svg {
        position: relative;
        top: 3px;
    }
    </style>

    <button id="copy-button" class="btn" onClick="copyToClipboard()">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" fill="var(--c-white)" viewBox="0 0 256 256">
        <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
    </svg>
    copy
    </button>
    `;

class CopyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const button = this.shadowRoot.querySelector("#copy-button");
    button.addEventListener("click", () => {
      updateManifest();
      const manifestState = getManifest();
      navigator.clipboard.writeText(JSON.stringify(manifestState));
    });
  }
}

// Define the new element
customElements.define("copy-button", CopyButton);
