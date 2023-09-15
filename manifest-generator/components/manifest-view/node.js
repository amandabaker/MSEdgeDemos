import { removeFieldFromManifest } from "../../state.js";
import "./json-array.js";

// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <style>
    .node {
      display: flex;
      flex-direction: row;
      align-items: start;
      margin-bottom: .1rem;
    }

    .node span {
      color: var(--c-gray-light);
    }

    .node[selected=true] span {
      color: var(--c-selected-key);
    }

    .node span[type="boolean"] {
      color: var(--c-blue);
    }

    .node .key {
      font-weight: bold;
      margin-left: 1rem;
      white-space: nowrap;
    }
    .node .value {
      margin-left: 1rem;
    }
    .node:hover button.remove {
      opacity: 1;
    }
    button.remove {
      opacity: 0;
      background-color: transparent;
      transition: var(--transition-color), opacity 200ms ease-in-out;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.2em;
      padding: 0.25em;
      cursor: pointer;
      color: var(--c-gray-light);
    }
    button.remove:hover {
      background-color: var(--c-bkg-secondary);
    }
  </style>
  <div class="node">
    <button type="button" class="remove">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="13" width="13"><rect width="256" height="256" fill="none"/><line x1="216" y1="60" x2="40" y2="60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/><path d="M200,60V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/><path d="M168,60V36a16,16,0,0,0-16-16H104A16,16,0,0,0,88,36V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/></svg>
    </button>
    <span class="key"></span>
    <span class="value"></span>
  </div>
`;
class Node extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.key = this.getAttribute("key");
    this.value = this.getAttribute("value");
    this.render();
  }

  static get observedAttributes() {
    return ["key", "value", "selected"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "key") {
      this.key = newValue;
    }
    if (name === "value") {
      this.value = newValue;
    }
    if (name === "selected") {
      const node = this.shadowRoot.querySelector(".node");
      node.setAttribute("selected", newValue === "true");
      return;
    }
    this.render();
  }

  render() {
    const nodeView = this.shadowRoot.querySelector(".node");
    const type = this.getAttribute("type");
    const keyView = this.shadowRoot.querySelector(".key");
    const valueView = this.shadowRoot.querySelector(".value");
    keyView.textContent = `"${this.key}" : `;
    this.removeButton = this.shadowRoot.querySelector(".remove");
    const isTopLevel = this.getAttribute("top-level") === "true";
    if (isTopLevel) {
      nodeView.addEventListener("click", (e) => {
        document.dispatchEvent(
          new CustomEvent("page-change", {
            detail: {
              pageId: this.key,
            },
          })
        );
        e.stopPropagation();
      });
      this.removeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.dispatchEvent(
          new CustomEvent("remove-node", { detail: { key: this.key } })
        );
      });
    } else {
      this.removeButton?.remove();
    }
    this.renderValue(valueView, type, this.value);
  }

  renderValue(element, type, value) {
    if (type === "array") {
      element.innerHTML = `<json-array json="${value}"></json-array>`;
      return;
    }
    if (type === "object") {
      element.innerHTML = `<json-view json="${value}"></json-view>`;
      return;
    }
    element.textContent = value;
    element.setAttribute("type", type);
  }
}

customElements.define("json-node", Node);

export default Node;
