// Component for text label radio buttons
// Usage:
// <radio-buttons options="option1,option2,option3"></radio-buttons>

class RadioButtons extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table");

    // Parse attribute for radio items
    let array = this.getAttribute("options").split(",");
    // Create a label/radio button for each item
    array.forEach((element) => {
      // Create radio button
      let radioButton = document.createElement("input");
      radioButton.setAttribute("id", element);
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", "radio-group");
      radioButton.setAttribute("value", element);
      // Create span element for custom radio buttons
      let spanElement = document.createElement("span");
      spanElement.setAttribute("class", "custom-radio");
      // Create radio label and append
      let radioLabel = document.createElement("label");
      radioLabel.setAttribute("class", "radio-button");
      radioLabel.innerHTML += `${element}`;
      radioLabel.append(radioButton);
      radioLabel.append(spanElement);
      // Append radio label to shadow DOM
      shadow.append(radioLabel);
    });

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `
      .radio-button {
        margin-left: 15px;
        display: block;
        position: relative;
        padding-left: 35px;
        cursor: pointer;
        margin-bottom: 10px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .radio-button input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .custom-radio {
        position: absolute;
        top: 0;
        left: 0;
        height: 15px;
        width: 15px;
        background-color: #252931;
        border-radius: 50%;
        border: 2px solid #ffffff;
        margin-top: 4px;
      }

      .custom-radio:after {
        content: "";
        position: absolute;
        display: none;
      }

      .radio-button input:checked ~ .custom-radio:after {
        display: block;
      }

      .radio-button .custom-radio:after {
        top: 2px;
        left: 2px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
      }

      .radio-button:hover input ~ .custom-radio {
        background-color: #ccc;
      }

      .radio-button input:checked ~ .custom-radio {
        background-color: #353942;
      }`;

    const stylesheetDefault = document.createElement("link");
    stylesheetDefault.setAttribute("rel", "stylesheet");
    stylesheetDefault.setAttribute(
      "href",
      "/manifest-generator/styles/defaults.css"
    );
    shadow.append(stylesheetDefault);

    // Append the style to the shadow DOM
    shadow.append(style);
  }

  connectedCallback() {
    const checkedValue = this.getAttribute("value");
    this.shadowRoot.getElementById(checkedValue).checked = true;
  }

  getUserInput() {
    const inputElement = this.shadowRoot.querySelector(
      "input[type='radio']:checked"
    );
    if (inputElement) {
      return inputElement.value;
    }
  }
}

// Define the new element
customElements.define("radio-buttons", RadioButtons);
