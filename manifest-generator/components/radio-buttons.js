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
      let tableItem = document.createElement("div");
      // Create radio button and append
      let radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", "radio-group");
      radioButton.setAttribute("value", element);
      tableItem.append(radioButton);
      // Create radio button label and append
      let radioLabel = document.createElement("label");
      radioLabel.textContent = element;
      tableItem.append(radioLabel);
      tableWrapper.append(tableItem);
    });

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `.tableitem {
        align-self: center;
      }

      .table {
        display: flex;
        flex-direction: column;
      }`;

    const stylesheetDefault = document.createElement("link");
    stylesheetDefault.setAttribute("rel", "stylesheet");
    stylesheetDefault.setAttribute(
      "href",
      "/manifest-generator/styles/defaults.css"
    );
    shadow.append(stylesheetDefault);

    // Append the table and style to the shadow DOM
    shadow.append(tableWrapper);
    shadow.append(style);
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
