import "./json.js";

import { getManifest } from "../../state.js";
import "./copy-button.js";

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
</style>
<div class="manifest-view">
    <h2>Manifest</h2>
    <copy-button></copy-button>
</div>
`;

// create a web component
class ManifestView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const manifestView = this.shadowRoot.querySelector(".manifest-view");
    const jsonView = document.createElement("json-view");
    jsonView.setAttribute(
      "json",
      encodeURIComponent(JSON.stringify(getManifest()))
    );
    jsonView.setAttribute(
      "selected-page-id",
      this.getAttribute("current-page-id")
    );
    jsonView.setAttribute("root", true);
    manifestView.appendChild(jsonView);

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
}

// create a web component
customElements.define("manifest-view", ManifestView);

// export to use in other files
export default ManifestView;
