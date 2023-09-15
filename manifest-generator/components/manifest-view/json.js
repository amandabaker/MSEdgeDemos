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
    const unsetFieldsValue = this.getAttribute("unset-fields");
    this.unsetFields = JSON.parse(decodeURIComponent(unsetFieldsValue));
    const fieldOrderValue = this.getAttribute("field-order");
    this.fieldOrder = JSON.parse(decodeURIComponent(fieldOrderValue));
    this.render();
  }

  static get observedAttributes() {
    return ["selected-page-id", "json", "unset-fields", "field-order"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "selected-page-id") {
      this.toggleSelectedPage(newValue);
    }
    if (name === "json" && newValue) {
      const decodedValue = decodeURIComponent(newValue);
      try {
        this.json = JSON.parse(decodedValue);
        this.render();
      } catch (e) {}
    }
    if (name === "unset-fields" && newValue) {
      const decodedValue = decodeURIComponent(newValue);
      try {
        this.unsetFields = JSON.parse(decodedValue);
        this.render();
      } catch (e) {}
    }
    if (name === "field-order" && newValue) {
      const decodedValue = decodeURIComponent(newValue);
      try {
        this.fieldOrder = JSON.parse(decodedValue);
        this.render();
      } catch (e) {}
    }
  }

  render() {
    const jsonView = this.shadowRoot.querySelector(".json");
    jsonView.innerHTML = "";
    const isRoot = this.getAttribute("root") !== null;
    const isSelectedPage = this.getAttribute("selected-page-id");

    this.renderNodes(
      jsonView,
      this.json,
      this.unsetFields,
      isSelectedPage,
      isRoot
    );
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

  renderNodes(jsonView, json, unsetFields, isSelectedPage, isRoot) {
    const keys = isRoot ? this.fieldOrder : Object.keys(json);
    keys.forEach((key) => {
      if (isRoot && unsetFields.includes(key)) {
        return;
      }

      const node = document.createElement("json-node");
      var nodeType = typeof json[key];
      // find if object is an array
      if (Array.isArray(json[key])) {
        nodeType = "array";
      }
      node.setAttribute("top-level", isRoot);
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
