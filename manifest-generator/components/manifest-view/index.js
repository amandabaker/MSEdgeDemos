import "./json.js";

import "./copy-button.js";
import "./unset-field.js";
import {
  getManifest,
  getUnsetFields,
  addFieldToManifest,
  removeFieldFromManifest,
  getFieldOrder,
} from "../../state.js";

// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
<style>
  .editor-wrapper {
    padding: 1em;
    height: 100%;
    overflow: hidden;
  }

  .editor {
    background-color: var(--c-bkg-dark);
    padding-top: 0;
    border-radius: var(--border-radius);
    height: 100%;
    overflow: auto;
  }

  .manifest-view {
    width: 100%;
    max-width: 600px;
    padding: 1em;
    padding-top: 0;
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

  hr {
    border-bottom: 2px solid var(--c-gray);
  }

  .toolbar {
    background-color: var(--c-bkg-dark);
    position: sticky;
    top: -0.1em;
    padding: 1em;
    padding-bottom: 0.5em;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: space-between
  }

  .toolbar .actions {
    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
  }
  p.section-label {
    margin-bottom: 0.7em;
  }

  .unset-field-list-wrapper {
    padding: 1em;
    padding-top: 0.5em;
  }
</style>

<div class="editor-wrapper">
  <div class="editor">
    <div class="manifest-view-wrapper">
      <div class="toolbar">
        <p>manifest.json</p>
        <div class="actions">
          <copy-button></copy-button>
          <styled-button type="secondary" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="15" height="15"><rect width="256" height="256" fill="none"/><line x1="128" y1="152" x2="128" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 112 128 152 88 112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            download
          </styled-button>
        </div>
      </div>
      <div class="manifest-view"></div>
    </div>
    <hr></hr>
    <div class="unset-field-list-wrapper">
    <p class="section-label">unset fields</p>
    <div class="unset-field-list"></div>
    </div>
  </div>
</div>
`;

// create a web component
class ManifestView extends HTMLElement {
  #jsonView;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const manifestView = this.shadowRoot.querySelector(".manifest-view");
    this.#jsonView = document.createElement("json-view");
    this.updateJsonViewAttributes();
    this.#jsonView.setAttribute(
      "selected-page-id",
      this.getAttribute("current-page-id")
    );
    this.#jsonView.setAttribute("root", true);
    manifestView.appendChild(this.#jsonView);

    this.unsetFieldListView =
      this.shadowRoot.querySelector(".unset-field-list");
    this.renderUnsetFields();
    document.addEventListener("page-change", (e) => {
      this.updateJsonViewAttributes();
      this.renderUnsetFields();
      this.setAttribute("current-page-id", e.detail.pageId);
    });

    document.addEventListener("manifest-change", (e) => {
      this.#jsonView.setAttribute(
        "json",
        encodeURIComponent(JSON.stringify(e.detail.manifest))
      );
    });
    document.addEventListener("remove-node", (e) => {
      removeFieldFromManifest(e.detail.key);
      this.updateJsonViewAttributes();
      this.renderUnsetFields();
    });
  }

  updateJsonViewAttributes() {
    this.#jsonView.setAttribute(
      "json",
      encodeURIComponent(JSON.stringify(getManifest()))
    );
    this.#jsonView.setAttribute(
      "unset-fields",
      encodeURIComponent(JSON.stringify(getUnsetFields()))
    );
    this.#jsonView.setAttribute(
      "field-order",
      encodeURIComponent(JSON.stringify(getFieldOrder()))
    );
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
        this.updateJsonViewAttributes();
        this.renderUnsetFields();
      });
    });
  }
}

// create a web component
customElements.define("manifest-view", ManifestView);

// export to use in other files
export default ManifestView;
