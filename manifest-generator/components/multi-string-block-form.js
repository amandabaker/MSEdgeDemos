const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
    <link rel="stylesheet" href="/manifest-generator/styles/input.css" />
    <style>
      #wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
      }
      button {
        font-size: 16px;
        background-color: transparent;
        transition: var(--transition-color);
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5em;
        color: var(--c-gray-light);
        padding: 0.8em;
        border-radius: 999px;
        cursor: pointer;
      }
      button:not(:disabled):hover {
        background-color: var(--c-bkg-secondary)
      }
      #new-block {
        align-self: start;
        padding-right: 1em;
      }
      #new-block:disabled {
        opacity: 0.3;
        cursor: default;
      }
      .block {
        display: flex;
        align-items: center;
        padding-right: 1em;
        margin-top: 5px;
      }
      .block styled-card {
        flex-grow: 1;
      }

      simple-text-input {
        flex-grow: 1;
      }
    </style>
    <div id="wrapper">
      <div id="blocks"></div>
      <button id="new-block" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="20" width="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        Add an entry
      </button>
      <div class="table">
        <label hidden></label>
        <p id="error-text" class="text-error" hidden>Input field invalid</p>
    </div>
    </div>
  `;

const createCardTemplate = (id) => {
  const cardTemplate = document.createElement("template");
  cardTemplate.innerHTML = `
      <div class="block" id="block-id-${id}">
        <simple-text-input id="field-id-${id}" placeholder="placeholder"></simple-text-input>
        <button id="trash-${id}" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="20" width="20"><rect width="256" height="256" fill="none"/><line x1="216" y1="60" x2="40" y2="60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M200,60V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M168,60V36a16,16,0,0,0-16-16H104A16,16,0,0,0,88,36V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </button>
      </div>
    `;
  return cardTemplate;
};

class MultiStringBlockForm extends HTMLElement {
  #blockListView;
  #value;
  #errorText;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.build();

    // // Load saved value from manifest
    if (this.getAttribute("value")) {
      this.getAttribute("value")
        .split(",")
        .forEach((valueItem, index) => {
          this.addBlock(valueItem);
        });
    }
  }

  build() {
    this.#value = [];
    this.newBlock = this.shadowRoot.querySelector("#new-block");
    this.newBlock.addEventListener("click", () => {
      this.addBlock();
    });

    this.#blockListView = this.shadowRoot.querySelector("#blocks");
    this.#errorText = this.shadowRoot.querySelector("#error-text");
  }

  disableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", true);
  }
  enableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", false);
  }

  addBlock(text) {
    const blockLength = this.#blockListView.children.length;
    const cardTemplate = createCardTemplate(blockLength);
    const cardNode = cardTemplate.content.cloneNode(true);
    this.#blockListView.append(cardNode);
    this.#value.push(text ? text : "");

    const blockInput = this.#blockListView.querySelector(
      `#field-id-${blockLength}`
    );
    blockInput.addEventListener("change", (e) => {
      this.#value[blockLength] = e.target.getUserInput();
    });

    if (text) {
      blockInput.setUserInput(text);
    }

    const trash = this.#blockListView.querySelector(`#trash-${blockLength}`);
    trash.addEventListener("click", () => {
      this.removeBlockAtIndex(blockLength);
    });

    if (this.#value.length >= this.getAttribute("max-number-of-blocks")) {
      this.disableAddNewButton();
      return;
    }
  }

  removeBlockAtIndex(blockIndex) {
    this.enableAddNewButton();

    this.#value.splice(blockIndex, 1);
    const blockInput = this.#blockListView.querySelector(
      `#block-id-${blockIndex}`
    );
    blockInput.remove();
  }

  getUserInput() {
    console.log(this.#value);
    return this.#value;
  }

  onValidationCheck(did_succeed, errorText) {
    if (did_succeed) {
      this.#errorText.setAttribute("hidden", "");
    } else {
      this.#errorText.textContent = errorText;
      this.#errorText.removeAttribute("hidden");
    }
  }
}

customElements.define("multi-string-block-form", MultiStringBlockForm);
