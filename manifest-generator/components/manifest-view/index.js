import "./json.js";

import { getManifest } from "../../state.js";
import "./copy-button.js";
import "./unset-field.js";
import {
  getManifest,
  getUnsetFields,
  addFieldToManifest,
} from "../../state.js";

// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
<style>
  .manifest-view {
    padding: 1rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  h2 {
    display: inline;
    padding-right: 50%;
  }
  .unset-field-list {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
</style>
<div class="manifest-view">
    <h2>Manifest</h2>
    <copy-button></copy-button>
</div>
<div class="unset-field-list">
</div>
`;

// create a web component
class ManifestView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const manifestView = this.shadowRoot.querySelector(".manifest-view");
    this.jsonView = document.createElement("json-view");
    this.jsonView.setAttribute(
      "json",
      encodeURIComponent(JSON.stringify(getManifest()))
    );
    this.jsonView.setAttribute(
      "unset-fields",
      encodeURIComponent(JSON.stringify(getUnsetFields()))
    );
    this.jsonView.setAttribute(
      "selected-page-id",
      this.getAttribute("current-page-id")
    );
    this.jsonView.setAttribute("root", true);
    manifestView.appendChild(this.jsonView);

    this.unsetFieldListView =
      this.shadowRoot.querySelector(".unset-field-list");
    this.renderUnsetFields();
    document.addEventListener("page-change", (e) => {
      this.setAttribute("current-page-id", e.detail.pageId);
    });

    document.addEventListener("manifest-change", (e) => {
      jsonView.setAttribute(
        "json",
        encodeURIComponent(JSON.stringify(e.detail.manifest))
      );
    });
  }

  static get observedAttributes() {
    return ["current-page-id"];
  }

  attributeChangedCallback(name) {
    if (name === "current-page-id") {
      const jsonView = this.shadowRoot.querySelector("json-view");
      jsonView.setAttribute(
        "selected-page-id",
        this.getAttribute("current-page-id")
      );
    }
  }

  renderUnsetFields() {
    this.unsetFieldListView.innerHTML = "";
    getUnsetFields().forEach((fieldKey) => {
      const unsetFieldView = document.createElement("unset-field");
      unsetFieldView.innerHTML = fieldKey;
      unsetFieldView.setAttribute("key", fieldKey);
      this.unsetFieldListView.append(unsetFieldView);
      unsetFieldView.addEventListener("fieldclick", (e) => {
        addFieldToManifest(e.detail.key);
        this.jsonView.setAttribute(
          "unset-fields",
          encodeURIComponent(JSON.stringify(getUnsetFields()))
        );
        this.renderUnsetFields();
      });
    });
  }
}

// create a web component
customElements.define("manifest-view", ManifestView);

// export to use in other files
export default ManifestView;
