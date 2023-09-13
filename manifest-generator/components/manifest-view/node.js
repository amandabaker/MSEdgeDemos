import "./json-array.js";

// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <style>
    .node {
      display: flex;
      flex-direction: row;
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

  </style>
  <div class="node">
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

  attributeChangedCallback(name, oldValue, newValue) {
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
    const node = this.shadowRoot.querySelector(".node");
    const type = this.getAttribute("type");
    const key = this.shadowRoot.querySelector(".key");
    const value = this.shadowRoot.querySelector(".value");
    key.textContent = `"${this.key}" : `;
    const isTopLevel = this.getAttribute("top-level") !== null;
    if (isTopLevel) {
      node.addEventListener("click", (e) => {
        document.dispatchEvent(
          new CustomEvent("page-change", {
            detail: {
              pageId: this.key,
            },
          })
        );
        e.stopPropagation();
      });
    }
    this.renderValue(value, type, this.value);
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
