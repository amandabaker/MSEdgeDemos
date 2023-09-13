const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
  <link rel="stylesheet" href="styles/card.css" />
  <div class="card"><slot></slot></div>
`;

const attributes = {};

class StyledCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
    this.button = this.shadowRoot.querySelector("button");
  }

  static get observedAttributes() {
    return Object.values(attributes).map((opt) => opt.name);
  }

  // This method doesn't validate any form inputs, just html attributes.
  validateAttributes(changedValue) {
    Object.entries(attributes).forEach(([field, opts]) => {
      if (changedValue !== undefined && opts.name !== changedValue) return;
      let attribute = this.getAttribute(opts.name);
      if ((attribute === undefined || attribute === null) && opts.default)
        attribute = opts.default;
      if (opts.required && (attribute === undefined || attributes === null))
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
      if (!opts.allowedValues.find((values) => values === attribute))
        throw new Error(
          `Attribute ${opts.name} can only be values: [${opts.allowedValues}]`
        );
      this[field] = attribute;
    });
  }

  connectedCallback() {
    this.validateAttributes();
  }

  attributeChangedCallback(_attr) {
    this.validateAttributes();
  }
}

customElements.define("styled-card", StyledCard);
