// Component for a page wrapper -- includes an h1 for page title and a slot for each custom component.
// See page-view-example.html for usage eaxmple.
// Has a public API `getId()` that returns this page's unique ID, set via page-id attribute.

class PageView extends HTMLElement {
  #id;

  constructor() {
    super();

    const pageViewTemplate = document.createElement("template");
    pageViewTemplate.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
    <style>
      #title {
        padding-top: 200px;
        text-align: center;
      }

      #content {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        padding-right: 20px;
      }

      #form-input {
        flex-grow: 1;
        overflow: hidden;
      }
    </style>


    <div id="content">    
      <h1 id="title">${this.getAttribute("title")}</h1>
      <div id="form-input"><slot></slot></div>
    </div>
    `;

    // Create a shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(pageViewTemplate.content.cloneNode(true));

    // Set the id field based on the id attribute
    this.#id = this.getAttribute("page-id");
  }

  get pageId() {
    return this.#id;
  }

  getUserInput() {
    let inputElements = this.shadowRoot
      .querySelector("slot")
      .assignedElements();
    return inputElements[0].getUserInput?.();
  }
}

// Define the new element
customElements.define("page-view", PageView);
