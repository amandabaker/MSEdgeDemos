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

const attributeOptions = {
  value: {
    name: "value",
    required: true,
    type: "JSON",
  },
  fields: {
    name: "fields",
    required: true,
    type: "JSON",
  },
  maxNumberOfBlocks: {
    name: "max-number-of-blocks",
    required: false,
    type: "number",
  },
};

class MultiBlockForm extends HTMLElement {
  #formTemplate;
  #blocksElement;
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
    this.#value = this.props.value;
    this.newBlock = this.shadowRoot.querySelector("#new-block");
    this.newBlock.addEventListener("click", () => {
      this.addBlock(this.props.value.length);
    });

    const slot = this.shadowRoot.querySelector("slot");
    const elements = slot.assignedElements();
    if (elements.length !== 1)
      throw new Error("Multi Block Form should only have one child");

    this.#formTemplate = elements[0];
    this.#blocksElement = this.shadowRoot.querySelector("#blocks");

    this.clearBlocks();
    this.#value.forEach((_, ii) => this.addBlock(ii));
  }

  clearBlocks() {
    while (this.#blocksElement.lastElementChild) {
      this.#blocksElement.removeChild(this.#blocksElement.lastElementChild);
    }
  }

  disableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", true);
  }
  enableAddNewButton() {
    this.newBlock.toggleAttribute("disabled", false);
  }

  addBlock(index) {
    if (index === this.props.maxNumberOfBlocks) return;
    if (index === this.props.maxNumberOfBlocks - 1) {
      this.disableAddNewButton();
    }
    if (index === this.#value.length) {
      this.#value[index] = Object.fromEntries(
        this.props.fields.map((k) => [k, ""])
      );
    }
    const form = this.#formTemplate.cloneNode(true);
    form.toggleAttribute("slot", false);
    this.props.fields.forEach((key) => {
      const field = form.querySelector(`[field-id=${key}]`);
      field.setAttribute("value", this.#value[index][key]);
    });
    const cardTemplate = createCardTemplate(index, form.innerHTML);
    const cardNode = cardTemplate.content.cloneNode(true);
    this.#blocksElement.append(cardNode);

    this.props.fields.forEach((key) => {
      const field = this.#blocksElement.querySelector(
        `#block-${index} [field-id=${key}]`
      );
      field.toggleAttribute("data-helloworld", true);
      field.addEventListener("change", (e) => {
        this.#value[index][key] = e.target.getUserInput();
      });
    });

    const trash = this.#blocksElement.querySelector(`#trash-${index}`);
    trash.setAttribute("index", index);
    trash.addEventListener("click", () => {
      this.removeBlock(index);
    });
  }

  removeBlock(index) {
    if (!this.#value[index]) return;
    this.enableAddNewButton();

    this.#value.splice(index, 1);
    const block = this.#blocksElement.querySelector(`#block-${index}`);
    block?.remove();

    this.clearBlocks();
    this.#value.forEach((_, ii) => this.addBlock(ii));
  }

  // This method doesn't validate any form inputs, just html attributes.
  validateAttributes(changedValue) {
    Object.entries(attributeOptions).forEach(([field, opts]) => {
      if (changedValue !== undefined && opts.name !== changedValue) return;
      let attr = this.getAttribute(opts.name);
      if ((attr === undefined || attr === null) && opts.default)
        attr = opts.default;
      if (opts.required && (attr === undefined || attributeOptions === null))
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
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

      if (opts.type === "JSON")
        this.props[field] = JSON.parse(
          this.getAttribute(opts.name).replace(/'/g, '"')
        );
      if (opts.type === "number")
        this.props[field] = parseFloat(this.getAttribute(opts.name));
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
      this.#value.forEach((_, ii) => this.addBlock(ii));
    }

    if (attr === attributeOptions.value.name) {
      if (!Array.isArray(this.props.value))
        throw new Error(
          `Attribute ${opts.name} should be an array in component ${this.tagName}`
        );
      this.props.value.forEach((block) => {
        Object.keys(block).forEach((key) => {
          if (!this.props.fields.includes(key))
            throw new Error(
              `Attribute value should have blocks with fields: [${this.props.fields}]\nField "${key}" is not in [${this.props.fields}]`
            );
        });
      });
    }
  }

  getUserInput() {
    return this.#value;
  }
}

customElements.define("multi-block-form", MultiBlockForm);
