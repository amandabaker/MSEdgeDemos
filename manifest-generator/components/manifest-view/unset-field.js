const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <style>
    .field {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 0.4em;
      background-color: transparent;
      transition: var(--transition-color);
      color: var(--c-gray-light);
      cursor: pointer;
      padding: 0.05em 0.5em 0.05em 0.3em;
      border-radius: 999px;
    }
    
    p {
      margin: 0;
      color: var(--c-gray-light);
    }

    .field:hover {
      background-color: var(--c-bkg-secondary);
    }
  </style>
  <div class="field">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="15" width="15"><rect width="256" height="256" fill="none"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    <p><slot></slot></p>
  </div>
`;

class UnsetField extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.key = this.getAttribute("key");
    const field = this.shadowRoot.querySelector(".field");
    field.addEventListener("click", () => {
      this.shadowRoot.dispatchEvent(
        new CustomEvent("fieldclick", {
          composed: true,
          bubbles: true,
          detail: {
            key: this.key,
          },
        })
      );
    });
  }
}

customElements.define("unset-field", UnsetField);
