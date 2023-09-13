// A split app-view to show the manifest viewer in the right pane and the editor in the left pane.

import "./manifest-view/index.js";
import "./navigation-view.js";
import "./page-view.js";
import "./styled-button.js";
import "./simple-text-input.js";
import "./display-mode.js";
import "./color-picker.js";
import "./long-text-input.js";
import "./radio-buttons.js";

const pageInfo = [
  {
    id: "name",
    title: "What's your app's name?",
    content: `<simple-text-input slot="text" placeholder-text="App name"></simple-text-input>`,
  },
  {
    id: "short_name",
    title: "Now give it a nice short name",
    content: `<simple-text-input slot="text" placeholder-text="Short name"></simple-text-input>`,
  },
  {
    id: "start_url",
    title: "Give me a start url",
    content: `<simple-text-input slot="text" placeholder-text="Start url"></simple-text-input>`,
  },
  {
    id: "display",
    title: "Set a display mode",
    content: `<display-mode slot="text"></display-mode>`,
  },
  {
    id: "background_color",
    title: "Pick a background color",
    content: `<color-picker slot="text"></color-picker>`,
  },
  {
    id: "theme_color",
    title: "Pick a theme color",
    content: `<color-picker slot="text"></color-picker>`,
  },
  {
    id: "description",
    title: "Provide a description",
    content: `<long-text-input slot="text" placeholder-text="Description"></long-text-input>`,
  },
  {
    id: "icons",
    title: "give me some icons",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "categories",
    title: "Categories",
    content: `<p slot="text">TBD</p>`,
  },
  {
    id: "display_override",
    title: "Display Override",
    content: `<p slot="text">TBD</p>`,
  },
  {
    id: "file_handlers",
    title: "File handlers",
    content: `<p slot="text">TBD</p>`,
  },
  {
    id: "id",
    title: "Choose an ID",
    content: `<simple-text-input slot="text" placeholder-text="ID"></simple-text-input>`,
  },
  {
    id: "orientation",
    title: "Choose an orientation",
    content: `<radio-buttons slot="text" options="any,natural,landscape,landscape-primary,landscape-secondary,portrait,portrait-primary,portrait-secondary"></radio-buttons>`,
  },
  {
    id: "prefer_related_applications",
    title: "Set prefer_related_applications",
    content: `<radio-buttons slot="text" options="true,false"></radio-buttons>`,
  },
  {
    id: "related_applications",
    title: "Set your related applications",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "protocol_handlers",
    title: "Set your protocol handlers",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "scope",
    title: "Choose a scope",
    content: `<simple-text-input slot="text" placeholder-text="Scope"></simple-text-input>`,
  },
  {
    id: "screenshot",
    title: "Add a screenshot",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "share_target",
    title: "Add a share target",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "shortcut",
    title: "Add a shortcut",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
  {
    id: "widgets",
    title: "Add a widget",
    content: `<p slot="text">COMBO PLACEHOLDER</p>`,
  },
];

const renderPages = () => {
  let pages = "";
  for (let page of pageInfo) {
    pages += `
    <page-view page-id="${page.id}" title="${page.title}">
      ${page.content}
    </page-view>
    `;
  }
  return pages;
};

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/manifest-generator/styles/defaults.css" />
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .app-view {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .app-view > * {
      flex: 1;
      overflow: auto;
    }

    .app-view > *:first-child {
      border-right: 1px solid #eee;
    }
  </style>
  <div class="app-view">
    <navigation-view current-id="${pageInfo[0].id}" page-selector="page-view">
      ${renderPages()}
    </navigation-view>
    <manifest-view current-page-id="${pageInfo[0].id}"></manifest-view>
  </div>
`;

class AppView extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.navigationView = this.shadowRoot.querySelector("navigation-view");

    this.currentPageIdIndex = 0;

    this.navigationView.addEventListener("next", () => this.nextPage());
    this.navigationView.addEventListener("prev", () => this.prevPage());
    this.navigationView.addEventListener("skip", () => this.skipPage());
  }

  nextPage() {
    this.jumpToPage(Math.min(this.currentPageIdIndex + 1, pageInfo.length - 1));
  }

  prevPage() {
    this.currentPageIdIndex--;
    if (this.currentPageIdIndex == -1) {
      this.currentPageIdIndex = pageInfo.length - 1;
    }
    this.jumpToPage(this.currentPageIdIndex);
  }

  skipPage() {
    this.jumpToPage(Math.min(this.currentPageIdIndex + 1, pageInfo.length - 1));
  }

  jumpToPage(pageIndex) {
    this.currentPageIdIndex = pageIndex;
    this.navigationView.setAttribute(
      "current-id",
      pageInfo[this.currentPageIdIndex].id
    );
    const manifestView = this.shadowRoot.querySelector("manifest-view");
    manifestView.setAttribute(
      "current-page-id",
      pageInfo[this.currentPageIdIndex].id
    );
  }
}

customElements.define("app-view", AppView);
