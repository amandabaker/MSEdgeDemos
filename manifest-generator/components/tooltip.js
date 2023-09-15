// A tooltip component that expands on click to show the documentation for the manifest property
// that the user is currently adding/updating.
const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
    <style>
    .tooltip {
        position: relative;
        display: flex;
        border-bottom: 1px dotted black;
        margin: 0.5em;
        padding: 1em;
        background-color: var(--c-gray);
        border-radius: 15px;
        flex-direction: column;
        cursor: pointer;
      }

    .tooltip .title {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s;
        display: flex;
        flex-flow: row wrap;
        align-content: space-between;
        justify-content: space-between;
        line-height: 24px;
        font-weight: bold;
    }

    .tooltip .title .title-wrap {
        display: flex;
        flex-flow: row wrap;
        align-content: space-between;
        justify-content: space-between;
        line-height: 24px;
        gap: 20px;
    }

    .tooltip .text {
        display: none;
        color: var(--c-white);
        padding: 1em;
        text-align: left;
    }

    .tooltip:hover .text {
        display: block;
    }

    .tooltip .text[locked="true"] {
        display: block;
    }

    .tooltip .arrow-down {
        display: none;
    }
    </style>

    <div class="tooltip">
    
      <div class="title">
        <div class="title-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M10.5 2.25V0.75q0 -0.305 0.223 -0.527t0.527 -0.223q0.305 0 0.527 0.223t0.223 0.527v1.5q0 0.305 -0.223 0.527t-0.527 0.223q-0.305 0 -0.527 -0.223t-0.223 -0.527zM4.5 5.25q0 0.305 -0.223 0.527t-0.527 0.223q-0.305 0 -0.527 -0.223L1.723 4.277q-0.223 -0.223 -0.223 -0.527t0.223 -0.527 0.527 -0.223q0.305 0 0.527 0.223l1.5 1.5q0.223 0.223 0.223 0.527zm16.5 -1.5q0 0.305 -0.223 0.527l-1.5 1.5q-0.223 0.223 -0.527 0.223t-0.527 -0.223 -0.223 -0.527q0 -0.305 0.223 -0.527l1.5 -1.5q0.223 -0.223 0.527 -0.223t0.527 0.223 0.223 0.527zm-3 8.051q0 1.605 -0.68 2.883t-1.898 2.285l-0.023 0.023 -1.066 5.777q-0.094 0.539 -0.504 0.879t-0.973 0.352H9.609q-0.27 0 -0.516 -0.094t-0.445 -0.258 -0.328 -0.387 -0.188 -0.492l-1.043 -5.789 -0.023 -0.023q-1.219 -0.996 -1.887 -2.273t-0.68 -2.883q0 -1.383 0.539 -2.578t1.465 -2.086 2.145 -1.395 2.602 -0.504q1.371 0 2.59 0.504t2.145 1.383 1.465 2.086 0.551 2.59zm-1.5 -0.094q0 -1.055 -0.434 -1.957t-1.172 -1.582 -1.676 -1.043 -1.969 -0.387q-1.02 0 -1.957 0.375t-1.676 1.055 -1.172 1.57 -0.445 1.969q0 1.301 0.492 2.273t1.488 1.781q0.234 0.199 0.375 0.422t0.211 0.539l0.504 2.777h4.336l0.516 -2.777q0.059 -0.316 0.199 -0.527t0.387 -0.422q0.984 -0.82 1.488 -1.793t0.504 -2.273zM2.25 10.5q0.305 0 0.527 0.223t0.223 0.527q0 0.305 -0.223 0.527t-0.527 0.223H0.75q-0.305 0 -0.527 -0.223T0 11.25q0 -0.305 0.223 -0.527t0.527 -0.223h1.5zm19.5 0q0.305 0 0.527 0.223t0.223 0.527q0 0.305 -0.223 0.527t-0.527 0.223h-1.5q-0.305 0 -0.527 -0.223t-0.223 -0.527q0 -0.305 0.223 -0.527t0.527 -0.223h1.5zM9.34 21l0.27 1.5h3.246l0.281 -1.5H9.34z" fill="var(--c-text)"/>
          </svg>
          <slot name="title"></slot>
        </div>
        <div class="arrow-up">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--c-text)" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.29289 15.7071C4.68342 16.0976 5.31658 16.0976 5.70711 15.7071L12 9.41421L18.2929 15.7071C18.6834 16.0976 19.3166 16.0976 19.7071 15.7071C20.0976 15.3166 20.0976 14.6834 19.7071 14.2929L12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L4.29289 14.2929C3.90237 14.6834 3.90237 15.3166 4.29289 15.7071Z" fill="var(--c-text)" />
          </svg>
        </div>
        <div class="arrow-down">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--c-text)" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7071 8.29289C19.3166 7.90237 18.6834 7.90237 18.2929 8.29289L12 14.5858L5.70711 8.29289C5.31658 7.90237 4.68342 7.90237 4.29289 8.29289C3.90237 8.68342 3.90237 9.31658 4.29289 9.70711L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L19.7071 9.70711C20.0976 9.31658 20.0976 8.68342 19.7071 8.29289Z" fill="var(--c-text)" />
          </svg>
        </div>
      </div>
      
      <div class="text" locked="false">
        <slot name="content"></slot>
      </div>
    </div>
    `;
class Tooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".tooltip").addEventListener("click", (e) => {
      // ignore double click.
      if (e.detail > 1) {
        return;
      }
      const arrowUp = this.shadowRoot.querySelector(".arrow-up");
      if (arrowUp.style.display === "none") {
        arrowUp.style.display = "block";
        this.shadowRoot.querySelector(".arrow-down").style.display = "none";
        this.shadowRoot.querySelector(".text").setAttribute("locked", "false");
      } else {
        arrowUp.style.display = "none";
        this.shadowRoot.querySelector(".arrow-down").style.display = "block";
        this.shadowRoot.querySelector(".text").setAttribute("locked", "true");
      }
    });
  }
}
// Define the new element
customElements.define("tooltip-component", Tooltip);
