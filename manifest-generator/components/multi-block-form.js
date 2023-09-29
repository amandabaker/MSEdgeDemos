const attributeOptions = {
  // The fields ids of all the form inputs in your form. All fields should have a field-id attribute.
  fields: {
    name: "fields",
    required: true,
    type: "JSON",
  },
  // The default value of the component, must be an array of objects each with field defined in `fields`
  value: {
    name: "value",
    required: false,
    type: "JSON",
    default: [],
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
    <button id="add-new-block" type="button">
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
  #addNewBlockButton;
  #blockListView;
  #formTemplate;
  #props;
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
    this.#value = this.#props.value;
    this.#addNewBlockButton = this.shadowRoot.querySelector("#add-new-block");
    this.#addNewBlockButton.addEventListener("click", () => {
      this.addBlockAtIndex(this.#props.value.length);
    });


    this.clearBlocks();
    this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
  }

  clearBlocks() {
    while (this.getBlockListView()?.lastElementChild) {
      this.getBlockListView().removeChild(this.getBlockListView().lastElementChild);
    }
  }

  disableAddNewButton() {
    this.#addNewBlockButton.toggleAttribute("disabled", true);
  }
  enableAddNewButton() {
    this.#addNewBlockButton.toggleAttribute("disabled", false);
  }

  dispatchValueChangeEvent() {
    this.shadowRoot.dispatchEvent(
      new CustomEvent("change", { bubbles: true, composed: true })
    );
  }

  onValidationCheck() {
    // TODO(Marcos): Show error;
  }

  getFormTemplate() {
    if (!this.#formTemplate) {
      const slot = this.shadowRoot.querySelector("slot");
      const elements = slot.assignedElements();
      if (elements.length !== 1)
        throw new Error("Multi Block Form should only have one child");

      this.#formTemplate = elements[0];
    }

    return this.#formTemplate;
  }

  getBlockListView() {
    if (!this.#blockListView) {
      this.#blockListView = this.shadowRoot.querySelector("#blocks");
    }

    return this.#blockListView;
  }

  addBlockAtIndex(blockIndex) {
    if (blockIndex === this.#props.maxNumberOfBlocks) return;
    if (blockIndex === this.#props.maxNumberOfBlocks - 1) {
      this.disableAddNewButton();
    }
    if (blockIndex === this.#value.length) {
      // TODO(Marcos): add explanation for this case.
      this.#value[blockIndex] = Object.fromEntries(
        this.#props.fields.map((k) => [k, null])
      );
      this.dispatchValueChangeEvent();
    }

    const form = this.getFormTemplate().cloneNode(true);
    this.#props.fields.forEach((key) => {
      const field = form.querySelector(`[field-id=${key}]`);
      const value = this.#value[blockIndex][key];
      if (typeof value === "string" || value instanceof String) {
        field.setAttribute("value", value);
        return;
      }
      const cleanedValue = value
        ? encodeURIComponent(JSON.stringify(value))
        : encodeURIComponent(JSON.stringify(field.defaultValue)) || "";
      field.setAttribute("value", cleanedValue);
    });
    const cardTemplate = createCardTemplate(blockIndex, form.innerHTML);
    const cardNode = cardTemplate.content.cloneNode(true);
    this.getBlockListView().append(cardNode);

    this.#props.fields.forEach((key) => {
      const field = this.getBlockListView().querySelector(
        `#block-${blockIndex} [field-id=${key}]`
      );
      field.addEventListener("change", (e) => {
        this.#value[blockIndex][key] = e.target.getUserInput();
        this.dispatchValueChangeEvent();
      });
    });

    const trash = this.getBlockListView().querySelector(`#trash-${blockIndex}`);
    trash.addEventListener("click", () => {
      this.removeBlockAtIndex(blockIndex);
    });
  }

  removeBlockAtIndex(blockIndex) {
    if (!this.#value[blockIndex]) return;
    this.enableAddNewButton();

    this.#value.splice(blockIndex, 1);
    this.dispatchValueChangeEvent();

    // Clear and redraw all the blocks.
    this.clearBlocks();
    this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
  }

  /**
   * Validate that all attributes specified on the multi-block form are valid
   * and that all required attributes are included.
   */
  validateAttributes() {
    Object.entries(attributeOptions).forEach((entry) => {
      this.validateAttributeEntry(entry);
    });
  }

  /** Validate a single attribute given the name of the attribute.
  / @field attributeName
  */
  validateAttribute(attributeName) {
    const entry = Object.entries(attributeOptions).find(([field, opts]) => {
      return opts.name == attributeName;
    });

    if (!entry) {
      throw new Error(
        `Can't validate unsupported attribute "${changedAttr}" in ${this.tagName}.`
      );
    }
    this.validateAttributeEntry(entry);
  }

  /**
   * Validate a single attribute given the attribute entry.
   * @field entry: an entry within |attributeOptions|
   */
  validateAttributeEntry(entry) {
    let [field, opts] = entry;
    let value = this.getAttribute(opts.name);
    if ((value === undefined || value === null) && opts.default) {
      value = opts.default;
    }
    if (opts.required && value === undefined) {
      throw new Error(
        `Attribute ${opts.name} should be set in component ${this.tagName}`
      );
    }

    if (!this.#props) {
      this.#props = {};
    }

    if (opts.type === "JSON") {
      const decodedValue = decodeURIComponent(value);
      this.#props[field] = JSON.parse(decodedValue);
    } else if (opts.type === "number") {
      this.#props[field] = parseFloat(this.getAttribute(opts.name));
    } else {
      this.#props[field] = value;
    }
  }

  connectedCallback() {
    this.validateAttributes();
    this.build();
  }

  attributeChangedCallback(name, oldValue) {
    this.validateAttribute(name);

    // Handle changes to the "value" attribute.
    if (name === attributeOptions.value.name) {
      if (oldValue !== null) {
        this.#value = this.#props.value;
        this.clearBlocks();
        this.#value.forEach((_entry, index) => this.addBlockAtIndex(index));
      }

      if (!Array.isArray(this.#props.value)) {
        throw new Error(
          `Attribute ${opts.name} should be an array in component ${this.tagName}`
        );
      }

      this.#props.value.forEach((block) => {
        Object.keys(block).forEach((key) => {
          if (!this.#props.fields.includes(key)) {
            throw new Error(
              `Attribute value should have blocks with fields: [${
                this.#props.fields
              }]\nField "${key}" is not in [${this.#props.fields}]`
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
