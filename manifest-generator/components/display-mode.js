// Component for a images as radio buttons.
/*
  Usage:
  <display-mode></display-mode>

*/

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
    <style>
    .table-item {
            align-self: center;
    }

    .table {
            display: flex;
            flex-direction: column;
          }

    .item-label {
        margin-left: 5px;
    }

    .radio-button {
        cursor: pointer;
    }

    .radio-button img {
        max-width: 100%; /* Adjust the image size as needed */
        border: 2px solid transparent;
        border-radius: 15px;
        padding: 5px;
        margin-top:5px;
        margin-bottom:15px;
    }

    .radio-button input[type="radio"] {
        display: none; /* Hide the default radio button input */
    }

    .radio-button input[type="radio"]:checked + img {
        border-color: white; /* Style the selected image */
        border-radius: 15px;
    }

    .label-radio-container {
        display:inline-block;
        align-self:center;
        text-align:left;
    }
    </style>

    <div class="table">
        <div class="label-radio-container">
            <label class="item-label">Minimal-UI</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="minimal-ui">
                        <img src="/manifest-generator/images/minimal-ui.png" alt="minimal-ui">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">Standalone</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="standalone">
                    <img src="/manifest-generator/images/standalone.png" alt="standalone">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">Fullscreen</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="fullscreen">
                    <img src="/manifest-generator/images/fullscreen.png" alt="fullscreen">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">Browser</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="browser">
                    <img src="/manifest-generator/images/browser.png" alt="browser">
                </label>
            </div>
        </div>
    </div>
`;

class DisplayMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getUserInput() {
    const inputElement = this.shadowRoot.querySelector(
      "input[type='radio']:checked"
    );
    if (inputElement) {
      return inputElement.value;
    }
    return;
  }
}

// Define the new element
customElements.define("display-mode", DisplayMode);
