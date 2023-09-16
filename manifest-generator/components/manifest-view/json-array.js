const template = document.createElement("template");
template.innerHTML = `
  <style>
    .node {
      display: flex;
      flex-direction: column;
      margin-bottom: .2rem;
    }

    .node::before {
      content: '[';
    }

    .node::after {
      content: ']';
    }
  </style>
  <div class="node"></div>
`;

class JSONArray extends HTMLElement {
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

  disconnectedCallback() {}

  render() {
    const jsonValue = this.json;
    const arrayNode = this.shadowRoot.querySelector(".node");
    for (let json of jsonValue) {
      let node;
      if (typeof json === "object") {
        node = document.createElement("json-view");
        node.setAttribute("json", encodeURIComponent(JSON.stringify(json)));
      } else if (Array.isArray(json)) {
        node = document.createElement("json-array");
        node.setAttribute("json", encodeURIComponent(JSON.stringify(json)));
      } else {
        node = document.createElement("json-node");
        node.setAttribute("value", json);
        node.setAttribute("type", typeof json);
      }
      arrayNode.appendChild(node);
    }
  }

  observedAttributes() {
    return ["json"];
  }
}

customElements.define("json-array", JSONArray);

export default JSONArray;
