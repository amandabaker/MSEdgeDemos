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
import "./styled-card.js";
import "./multi-block-form.js";
import "./simple-text-input.js";
import { updateManifest } from "../state.js";

const pageInfo = [
  {
    id: "name",
    title: "What's your app's name?",
    content: `<simple-text-input placeholder-text="App name"></simple-text-input>`,
  },
  {
    id: "short_name",
    title: "Now give it a nice short name",
    content: `<simple-text-input placeholder-text="Short name"></simple-text-input>`,
  },
  {
    id: "start_url",
    title: "Give me a start url",
    content: `<simple-text-input placeholder-text="Start url"></simple-text-input>`,
  },
  {
    id: "display",
    title: "Set a display mode",
    content: `<display-mode></display-mode>`,
  },
  {
    id: "background_color",
    title: "Pick a background color",
    content: `<color-picker></color-picker>`,
  },
  {
    id: "theme_color",
    title: "Pick a theme color",
    content: `<color-picker></color-picker>`,
  },
  {
    id: "description",
    title: "Provide a description",
    content: `<long-text-input placeholder-text="Description"></long-text-input>`,
  },
  {
    id: "icons",
    title: "give me some icons",
    content: `
        <multi-block-form max-number-of-blocks="3" fields="['field-1','field-2']" value="[{'field-1':'value', 'field-2':'value-2'}, {'field-1':'value-5', 'field-2':'value-4'}]">
          <div slot="form">
            <simple-text-input field-id="field-1" placeholder="placeholder" label="label"></simple-text-input>
            <simple-text-input field-id="field-2" placeholder="placeholder" label="label 2"></simple-text-input>
         </div>
        </multi-block-form>`,
  },
  {
    id: "categories",
    title: "Categories",
    content: `<p>TBD</p>`,
  },
  {
    id: "display_override",
    title: "Display Override",
    content: `<p>TBD</p>`,
  },
  {
    id: "file_handlers",
    title: "File handlers",
    content: `<p>TBD</p>`,
  },
  {
    id: "id",
    title: "Choose an ID",
    content: `<simple-text-input placeholder-text="ID"></simple-text-input>`,
  },
  {
    id: "orientation",
    title: "Choose an orientation",
    content: `<radio-buttons options="any,natural,landscape,landscape-primary,landscape-secondary,portrait,portrait-primary,portrait-secondary"></radio-buttons>`,
  },
  {
    id: "prefer_related_applications",
    title: "Set prefer_related_applications",
    content: `<radio-buttons options="true,false"></radio-buttons>`,
  },
  {
    id: "related_applications",
    title: "Set your related applications",
    content: `<p>COMBO PLACEHOLDER</p>`,
  },
  {
    id: "protocol_handlers",
    title: "Set your protocol handlers",
    content: `<p>COMBO PLACEHOLDER</p>`,
  },
  {
    id: "scope",
    title: "Choose a scope",
    content: `<simple-text-input placeholder-text="Scope"></simple-text-input>`,
  },
  {
    id: "screenshot",
    title: "Add a screenshot",
    content: `<p>COMBO PLACEHOLDER</p>`,
  },
  {
    id: "share_target",
    title: "Add a share target",
    content: `<p>COMBO PLACEHOLDER</p>`,
  },
  {
    id: "shortcut",
    title: "Add a shortcut",
    content: `<p>COMBO PLACEHOLDER</p>`,
  },
  {
    id: "widgets",
    title: "Add a widget",
    content: `<p>COMBO PLACEHOLDER</p>`,
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
      height: 100%;
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

    document.addEventListener("page-change", (e) => {
      this.navigationView.setAttribute("current-id", e.detail.pageId);
      this.currentPageIdIndex =
        e.detail.index !== undefined
          ? e.detail.index
          : (() => {
              // get the index of the page from the pageInfo array.
              for (let i = 0; i < pageInfo.length; i++) {
                if (pageInfo[i].id === e.detail.pageId) {
                  return i;
                }
              }
              return 0;
            })();
    });
  }

  nextPage() {
    this.updateManifest();
    this.jumpToPage(Math.min(this.currentPageIdIndex + 1, pageInfo.length - 1));
  }

  prevPage() {
    this.updateManifest();
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
    this.dispatchPageChangeEvent();
  }

  dispatchPageChangeEvent() {
    document.dispatchEvent(
      new CustomEvent("page-change", {
        composed: true,
        bubbles: true,
        detail: {
          pageId: pageInfo[this.currentPageIdIndex].id,
          index: this.currentPageIdIndex,
        },
      })
    );
  }

  // To-do: Update this to use events.
  updateManifest() {
    const pageId = pageInfo[this.currentPageIdIndex].id;
    const page = this.shadowRoot.querySelector(
      `page-view[page-id="${pageId}"]`
    );
    const value = page.getUserInput();
    updateManifest(pageId, value);
  }
}

customElements.define("app-view", AppView);
