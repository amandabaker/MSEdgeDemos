import "./node.js";

// Define a custom element for representing a JSON document
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <style>
    .json {
      padding: .2rem;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .json::before {
      content: '{';
    }
    .json::after {
      content: '}';
    }
  </style>
  <div class="json"></div>
`;

class JSONView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const jsonValue = this.getAttribute("json");
    this.json = JSON.parse(decodeURIComponent(jsonValue));

    this.render();
  }

  static get observedAttributes() {
    return ["selected-page-id", "json"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "selected-page-id") {
      this.toggleSelectedPage(newValue);
    }
    if (name === "json") {
      this.json = JSON.parse(decodeURIComponent(newValue));
      this.render();
    }
  }

  render() {
    const jsonView = this.shadowRoot.querySelector(".json");
    jsonView.innerHTML = "";
    const isRoot = this.getAttribute("root") !== null;
    const isSelectedPage = this.getAttribute("selected-page-id");
    jsonView.addEventListener("click", (e) => {
      if (isRoot) {
        return;
      }
      const isCollapsed = jsonView.getAttribute("collapsed") !== null;
      jsonView.toggleAttribute("collapsed");
      if (isCollapsed) {
        jsonView.innerHTML = "";
        this.renderNodes(jsonView, this.json);
      } else {
        jsonView.innerHTML = "...";
      }
      e.stopPropagation();
    });

    this.renderNodes(jsonView, this.json, isSelectedPage);
  }

  toggleSelectedPage(selectedPageId) {
    const jsonView = this.shadowRoot.querySelector(".json");
    for (let child of jsonView.children) {
      if (child.getAttribute("key") === selectedPageId) {
        child.setAttribute("selected", true);
      } else {
        child.removeAttribute("selected");
      }
    }
  }

  renderNodes(jsonView, json, isSelectedPage) {
    Object.keys(json).forEach((key) => {
      const node = document.createElement("json-node");
      var nodeType = typeof json[key];
      // find if object is an array
      if (Array.isArray(json[key])) {
        nodeType = "array";
      }
      node.setAttribute("type", nodeType);
      node.setAttribute("selected", isSelectedPage === key);
      // if the value is an object, add values recursively
      if (nodeType === "object" || nodeType === "array") {
        node.setAttribute("key", key);
        node.setAttribute(
          "value",
          encodeURIComponent(JSON.stringify(json[key]))
        );
        jsonView.appendChild(node);
        return;
      }
      node.setAttribute("key", key);
      node.setAttribute("value", json[key]);
      jsonView.appendChild(node);
    });
  }
}

customElements.define("json-view", JSONView);

export default JSONView;
