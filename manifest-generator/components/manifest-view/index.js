import "./json.js";

const json = {
  name: "manifest-generator",
  short_name: "manifest-generator",
  start_url: "/",
  display: "standalone",
  background_color: "#fff",
  theme_color: "#fff",
  description: "A simple tool to generate a web app manifest",
  icons: [
    {
      src: "https://manifest-gen.now.sh/static/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "https://manifest-gen.now.sh/static/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  "prefer_related_applications": false,
};

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
</style>
<div class="manifest-view">
  <h2>Manifest</h2>
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
    jsonView.setAttribute("json", encodeURIComponent(JSON.stringify(json)));
    jsonView.setAttribute("selected-page-id", this.getAttribute("current-page-id"));
    jsonView.setAttribute("root", true);
    manifestView.appendChild(jsonView);
  }

  static get observedAttributes() {
    return ["current-page-id"];
  }

  attributeChangedCallback(name) {
    if (name === "current-page-id") {
      const jsonView = this.shadowRoot.querySelector("json-view");
      jsonView.setAttribute("selected-page-id", this.getAttribute("current-page-id"));
    }
  }
}

// create a web component
customElements.define("manifest-view", ManifestView);

// export to use in other files
export default ManifestView;
