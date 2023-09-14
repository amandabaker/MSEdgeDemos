const attributeOptions = {
  // The default value of the component, must be an array of objects each with field defined in `fields`
  value: {
    name: "value",
    required: true,
    type: "JSON",
  },
  // The fields ids of all the form inputs in your form. All fields should have a field-id attribute.
  fields: {
    name: "fields",
    required: true,
    type: "JSON",
  },
  // The max number of blocks the user can add.
  maxNumberOfBlocks: {
    name: "max-number-of-blocks",
    required: false,
    type: "number",
  },
};

const template = document.createElement("template");
template.innerHTML = `
  <style>
    #wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: scroll;
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
    }
    .block styled-card {
      flex-grow: 1;
    }
  </style>
  <div hidden><slot name="form"></slot></div>
  <div id="wrapper">
    <div id="blocks"></div>
    <button id="new-block" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="20" width="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
      Add an entry
    </button>
  </div>
`;

const createCardTemplate = (id, formHTML) => {
  const cardTemplate = document.createElement("template");
  cardTemplate.innerHTML = `
    <div class="block" id="block-${id}">
      <styled-card> ${formHTML} </styled-card>
      <button id="trash-${id}" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="20" width="20"><rect width="256" height="256" fill="none"/><line x1="216" y1="60" x2="40" y2="60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M200,60V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M168,60V36a16,16,0,0,0-16-16H104A16,16,0,0,0,88,36V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
      </button>
    </div>
  `;
  return cardTemplate;
};

class MultiBlockForm extends HTMLElement {
  #formTemplate;
  #blockListView;
  #value;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return Object.values(attributeOptions).map((opt) => opt.name);
  }

  build() {
    // Props should not be updated for internal value, that is why we copy it
    // into an internal property, #value.
    this.#value = this.props.value;
    this.newBlock = this.shadowRoot.querySelector("#new-block");
    this.newBlock.addEventListener("click", () => {
      this.addBlockAtIndex(this.props.value.length);
    });
    
    const slot = this.shadowRoot.querySelector("slot");
    const elements = slot.assignedElements();
    if (elements.length !== 1)
      throw new Error("Multi Block Form should only have one child");

    this.#formTemplate = elements[0];
    this.#blockListView = this.shadowRoot.querySelector("#blocks");

    this.clearBlocks();
    this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
  }

  clearBlocks() {
    while (this.#blockListView.lastElementChild) {
      this.#blockListView.removeChild(this.#blockListView.lastElementChild);
    }
  }

  disableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", true);
  }
  enableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", false);
  }

  addBlockAtIndex(blockIndex) {
    if (blockIndex === this.props.maxNumberOfBlocks) return;
    if (blockIndex === this.props.maxNumberOfBlocks - 1) {
      this.disableAddNewButton();
    }
    if (blockIndex === this.#value.length) {
      // Object.fromEntries API:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
      // TODO(Marcos): add explanation for this case.
      this.#value[blockIndex] = Object.fromEntries(
        this.props.fields.map((k) => [k, ""])
      );
    }

    const form = this.#formTemplate.cloneNode(true);
    this.props.fields.forEach((key) => {
      const field = form.querySelector(`[field-id=${key}]`);
      field.setAttribute("value", this.#value[blockIndex][key]);
    });
    const cardTemplate = createCardTemplate(blockIndex, form.innerHTML);
    const cardNode = cardTemplate.content.cloneNode(true);
    this.#blockListView.append(cardNode);

    this.props.fields.forEach((key) => {
      const field = this.#blockListView.querySelector(
        `#block-${blockIndex} [field-id=${key}]`
      );
      field.addEventListener("change", (e) => {
        this.#value[blockIndex][key] = e.target.getUserInput();
      });
    });

    const trash = this.#blockListView.querySelector(`#trash-${blockIndex}`);
    trash.addEventListener("click", () => {
      this.removeBlockAtIndex(blockIndex);
    });
  }

  removeBlockAtIndex(blockIndex) {
    if (!this.#value[blockIndex]) return;
    this.enableAddNewButton();

    this.#value.splice(blockIndex, 1);

    // Clear and redraw all the blocks.
    this.clearBlocks();
    this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
  }

  /** This method doesn't validate any form inputs, just html attributes.
  / @field changedValue 
  */
  validateAttributes(changedValue) {
    Object.entries(attributeOptions).forEach(([field, opts]) => {
      //
      if (changedValue !== undefined && opts.name !== changedValue) {
        return;
      }
      let attr = this.getAttribute(opts.name);
      if ((attr === undefined || attr === null) && opts.default) {
        attr = opts.default;
      }
      if (opts.required && (attr === undefined || attributeOptions === null)) {
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
      }
      if (
        opts.allowedValues &&
        !opts.allowedValues.find((values) => values === attr)
      ) {
        throw new Error(
          `Attribute ${opts.name} can only be values: [${opts.allowedValues}]`
        );
      }
      if (!this.props) this.props = {};

      this.props[field] = attr;

      if (opts.type === "JSON") {
        this.props[field] = JSON.parse(
          this.getAttribute(opts.name).replace(/'/g, '"')
        );
      }
      if (opts.type === "number") {
        this.props[field] = parseFloat(this.getAttribute(opts.name));
      }
    });
  }

  connectedCallback() {
    this.validateAttributes();
    this.build();
  }

  attributeChangedCallback(attr, old) {
    this.validateAttributes(attr);
    if (old !== null && attr === attributeOptions.value.name) {
      this.clearBlocks();
      this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
    }

    if (attr === attributeOptions.value.name) {
      if (!Array.isArray(this.props.value)) {
        throw new Error(
          `Attribute ${opts.name} should be an array in component ${this.tagName}`
        );
      }
      this.props.value.forEach((block) => {
        Object.keys(block).forEach((key) => {
          if (!this.props.fields.includes(key)) {
            throw new Error(
              `Attribute value should have blocks with fields: [${this.props.fields}]\nField "${key}" is not in [${this.props.fields}]`
            );
          }
        });
      });
    }
  }

  getUserInput() {
    return this.#value;
  }
}

customElements.define("multi-block-form", MultiBlockForm);
