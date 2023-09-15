const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <link rel="stylesheet" href="/manifest-generator/styles/button.css" />
  <button class="btn-primary"><slot></slot></button>
`;

const attributeOptions = {
  // type: "primary" | "secondary"
  type: {
    name: "type",
    required: false,
    allowedValues: ["primary", "secondary"],
    default: "primary",
  },
  size: {
    name: "size",
    required: false,
    allowedValues: ["sm", "base"],
    default: "base",
  },
};

class StyledButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
    this.button = this.shadowRoot.querySelector("button");
  }

  static get observedAttributes() {
    return Object.values(attributeOptions).map((opt) => opt.name);
  }

  // This method doesn't validate any form inputs, just html attributes.
  validateAttributes(changedValue) {
    Object.entries(attributeOptions).forEach(([field, opts]) => {
      if (changedValue !== undefined && opts.name !== changedValue) return;
      let attribute = this.getAttribute(opts.name);
      if ((attribute === undefined || attribute === null) && opts.default)
        attribute = opts.default;
      if (
        opts.required &&
        (attribute === undefined || attributeOptions === null)
      )
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
      if (!opts.allowedValues.find((values) => values === attribute))
        throw new Error(
          `Attribute ${opts.name} can only be values: [${opts.allowedValues}]`
        );
      if (!this.props) this.props = {};
      this.props[field] = attribute;
    });
  }

  connectedCallback() {
    this.validateAttributes();
    this.button.setAttribute("size", this.props.size);
  }

  attributeChangedCallback(attr) {
    this.validateAttributes();

    if (attr === attributeOptions.type.name) {
      this.button.classList.toggle(
        "btn-primary",
        this.props.type === "primary"
      );
      this.button.classList.toggle(
        "btn-secondary",
        this.props.type === "secondary"
      );
    }
  }
}

customElements.define("styled-button", StyledButton);
