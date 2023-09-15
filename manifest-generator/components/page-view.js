// Component for a page wrapper -- includes an h1 for page title and a slot for each custom component.
// See page-view-example.html for usage eaxmple.
// Has a public API `getId()` that returns this page's unique ID, set via page-id attribute.

import "./tooltip.js";

class PageView extends HTMLElement {
  #id;
  #controlTypesWithoutTopPadding = ["MULTI-BLOCK-FORM"];
  #paddingTop = 200;

  constructor() {
    super();

    const pageViewTemplate = document.createElement("template");
    pageViewTemplate.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
    <div id="content">    
      <h1 id="title">${this.getAttribute("title")}</h1>
      <div id="form-input"><slot></slot></div>
      <tooltip-component>
        <span slot="title">${this.getAttribute("tooltip-title")}</span>
        <div slot="content">${this.getAttribute("tooltip-content")}</div>
      </tooltip-component>
    </div>
    `;

    // Create a shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(pageViewTemplate.content.cloneNode(true));

    // Set the id field based on the id attribute
    this.#id = this.getAttribute("page-id");

    // Check to see if the slotted control is one of the special controls
    // that wants the title at the top.
    const slots = this.shadowRoot.querySelector("slot").assignedElements();
    const tagInSlot = slots[0].tagName;
    if (this.#controlTypesWithoutTopPadding.indexOf(tagInSlot) > -1) {
      this.#paddingTop = 0;
    }

    const style = document.createElement("style");
    style.innerHTML = `
    #title {
      padding-top: ${this.#paddingTop}px;
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
    }`;
    this.shadowRoot.appendChild(style);
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
