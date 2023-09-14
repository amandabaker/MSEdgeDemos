const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <link rel="stylesheet" href="/manifest-generator/styles/card.css" />
  <div class="card"><slot></slot></div>
`;

class StyledCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: "open",
    });
    shadow.append(template.content.cloneNode(true));
  }
}

customElements.define("styled-card", StyledCard);
