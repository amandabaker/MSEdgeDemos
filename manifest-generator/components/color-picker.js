// Component for a color picker -- a color input box.
/*
  Usage:
  <color-picker></color-picker>
*/
class ColorPicker extends HTMLElement {
  #inputElement;
  constructor() {
    super();
    this.#inputElement = document.createElement("input");

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create the input container
    const container = document.createElement("div");
    container.setAttribute("class", "container");

    // Create the input element
    this.#inputElement.setAttribute("type", "color");
    this.#inputElement.value = this.getAttribute("value") || "#cd5d5d";
    this.#inputElement.setAttribute("class", "container-item");

    container.append(this.#inputElement);

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `.container {
      display: flex;
      justify-content: center;
    }

    .container-item {
      align-self: center;
    }

    input[type="color"] {
      height: 100px;
      width: 100px;
      border-radius: 15px;
      padding: 6px;
    }`;

    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", "/manifest-generator/styles/defaults.css");

    // Append the container and style to the shadow DOM
    shadow.append(container);
    shadow.append(style);
    shadow.append(stylesheet);
  }

  getUserInput() {
    return this.#inputElement.value;
  }
}

// Define the new element
customElements.define("color-picker", ColorPicker);
