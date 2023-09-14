const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <link rel="stylesheet" href="/manifest-generator/styles/input.css" />
  <style>
    .table {
      display: flex;
      flex-direction: column;
      gap: 0.7em;
    }

    label {
      margin-left: 0.1em;
    }
  </style>
  <div class="table">
    <label hidden></label>
    <input type="text" />
    <p id="error-text" hidden>Input field invalid</p>
  </div>
`;

const attributeOptions = {
  label: {
    name: "label",
    required: false,
  },
  placeholder: {
    name: "placeholder",
    required: false,
  },
  value: {
    name: "value",
    required: false,
  },
};

// Component for a simple text input field. Optional attributes for a label and placeholder text.
// See simple-text-input-example.html for usage examples.
class SimpleTextInput extends HTMLElement {
  #inputElement;
  #errorText;

  constructor() {
    super();
    // console.trace();
    // console.log(this);

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));

    // Create the page label
    const label = this.shadowRoot.querySelector("label");
    const labelAttribute = this.getAttribute("label");
    if (labelAttribute) label.textContent = labelAttribute;
    label.toggleAttribute("hidden", !labelAttribute);

    this.#inputElement = this.shadowRoot.querySelector("input");
    const placeholderAttribute = this.getAttribute(
      attributeOptions.placeholder.name
    );
    if (placeholderAttribute)
      this.#inputElement.setAttribute("placeholder", placeholderAttribute);

    this.#inputElement.value =
      this.getAttribute(attributeOptions.value.name) || "";

    this.#errorText = this.shadowRoot.querySelector("id", "error-text");
  }

  getUserInput() {
    return this.#inputElement.value;
  }

  // This method doesn't validate any form inputs, just html attributes.
  validateAttributes(changedValue) {
    Object.entries(attributeOptions).forEach(([field, opts]) => {
      if (changedValue !== undefined && opts.name !== changedValue) return;
      let attribute = this.getAttribute(opts.name);
      if ((attribute === undefined || attribute === null) && opts.default)
        attribute = opts.default;
      if (opts.required && (attribute === undefined || attributes === null))
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
      if (!this.props) this.props = {};
      this.props[field] = attribute;
    });
  }
  connectedCallback() {
    this.validateAttributes();
    this.#inputElement.addEventListener("change", () => {
      this.shadowRoot.dispatchEvent(
        new CustomEvent("change", { bubbles: true, composed: true })
      );
    });
  }
  attributeChangedCallback(attr, oldVal) {
    this.validateAttributes(attr);
    if (oldVal !== null && attr == attributeOptions.value.name)
      this.#inputElement.value = this.props.value;
  }

  onValidationCheck(did_succeed, errorText) {
    if (did_succeed) {
      this.#inputElement.removeAttribute("error");
      this.#errorText.setAttribute("hidden", "");
    } else {
      this.#errorText.textContent = errorText;
      this.#inputElement.setAttribute("error", "");
      this.#errorText.removeAttribute("hidden");
    }
  }
}

// Define the new element
customElements.define("simple-text-input", SimpleTextInput);
