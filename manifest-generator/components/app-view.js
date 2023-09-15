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
import {
  addNextUnsetFieldToManifest,
  getFieldOrder,
  updateManifest,
  getManifest,
} from "../state.js";
import * as validations from "../validation.js";

const manifest = getManifest();

const pageInfo = {
  name: {
    title: "What's your app's name?",
    content: `<simple-text-input placeholder-text="App name" value="${manifest.name}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateName,
    },
  },
  short_name: {
    title: "Now give it a nice short name",
    content: `<simple-text-input placeholder-text="Short name" value="${manifest.short_name}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateShortName,
    },
  },
  start_url: {
    title: "Give me a start url",
    content: `<simple-text-input placeholder-text="Start url" value="${manifest.start_url}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateStartUrl,
    },
  },
  display: {
    title: "Set a display mode",
    content: `<display-mode></display-mode>`,
    validation: {
      type: "string",
      fn: validations.validateDisplay,
    },
  },
  background_color: {
    title: "Pick a background color",
    content: `<color-picker value="${manifest.background_color}"></color-picker>`,
    validation: {
      type: "string",
      fn: validations.validateBackgroundColor,
    },
  },
  theme_color: {
    title: "Pick a theme color",
    content: `<color-picker value="${manifest.theme_color}"></color-picker>`,
    validation: {
      type: "string",
      fn: validations.validateThemeColor,
    },
  },
  description: {
    title: "Provide a description",
    content: `<long-text-input placeholder-text="Description" value="${manifest.description}"></long-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateDescription,
    },
  },
  icons: {
    title: "give me some icons",
    content: `
        <multi-block-form max-number-of-blocks="3" fields="['src','sizes','type']" value="[{'src': '/', 'sizes':'200x200', 'type': 'png'}]">
          <div slot="form">
            <simple-text-input field-id="src" placeholder="placeholder" label="src"></simple-text-input>
            <simple-text-input field-id="sizes" placeholder="placeholder" label="sizes"></simple-text-input>
            <simple-text-input field-id="type" placeholder="placeholder" label="type"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      fn: validations.validateIcons,
    },
  },
  categories: {
    title: "Categories",
    content: `<p>TBD</p>`,
    validation: {
      type: "array",
      fn: () => "",
    },
  },
  display_override: {
    title: "Display Override",
    content: `<p>TBD</p>`,
    validation: {
      type: "array",
      fn: () => "",
    },
  },
  file_handlers: {
    title: "File handlers",
    content: `<p>TBD</p>`,
    validation: {
      type: "array",
      fn: () => "",
    },
  },
  id: {
    title: "Choose an ID",
    content: `<simple-text-input placeholder-text="ID" value="${manifest.id}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: () => "",
    },
  },
  orientation: {
    title: "Choose an orientation",
    content: `<radio-buttons options="any,natural,landscape,landscape-primary,landscape-secondary,portrait,portrait-primary,portrait-secondary"></radio-buttons>`,
    validation: {
      type: "string",
      fn: validations.validateOrientation,
    },
  },
  prefer_related_applications: {
    title: "Set prefer_related_applications",
    content: `<radio-buttons options="true,false"></radio-buttons>`,
    validation: {
      type: "bool",
      fn: validations.validatePreferRelatedApplications,
    },
  },
  related_applications: {
    title: "Set your related applications",
    content: `
        <multi-block-form fields="['platform','url', 'id']" value="[{'platform': '','url': '', 'id': ''}]">
          <div slot="form">
            <simple-text-input field-id="platform" placeholder="windows" label="platform"></simple-text-input>
            <simple-text-input field-id="url" placeholder="https://path.to.store.app/my-app" label="URL"></simple-text-input>
            <simple-text-input field-id="id" placeholder="com.example.app1" label="id"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
  protocol_handlers: {
    title: "Set your protocol handlers",
    content: `
        <multi-block-form fields="['protocol','url']" value="[{'protocol': '','url': ''}]">
          <div slot="form">
            <simple-text-input field-id="protocol" placeholder="web+customProtocol" label="protocol"></simple-text-input>
            <simple-text-input field-id="url" placeholder="https://my.app/?uri=%s" label="url"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
  scope: {
    title: "Choose a scope",
    content: `<simple-text-input placeholder-text="Scope" value="${manifest.scope}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateScope,
    },
  },
  screenshot: {
    title: "Add screenshots",
    content: `
        <multi-block-form fields="['src','sizes', 'type', 'form_factor' , 'label' ]" value="[{'src': '','sizes': '', 'type': '', 'form_factor': '', 'label': ''}]">
          <div slot="form">
            <simple-text-input field-id="src" placeholder="screenshot1.webp" label="src"></simple-text-input>
            <simple-text-input field-id="sizes" placeholder="1280x720" label="sizes"></simple-text-input>
            <simple-text-input field-id="type" placeholder="image/webp" label="type"></simple-text-input>
            <simple-text-input field-id="form_factor" placeholder="wide" label="form_factor"></simple-text-input>
            <simple-text-input field-id="label" placeholder="Homescreen of Awesome App" label="label"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
  share_target: {
    title: "Add a share target",
    content: `<p>COMBO PLACEHOLDER</p>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
  shortcut: {
    title: "Add a shortcut",
    content: `
        <multi-block-form fields="['name','url', 'description' ]" value="[{'name': '','url': '', 'description': ''}]">
          <div slot="form">
            <simple-text-input field-id="name" placeholder="Today's agenda" label="name"></simple-text-input>
            <simple-text-input field-id="url" placeholder="/today" label="url"></simple-text-input>
            <simple-text-input field-id="description" placeholder="List of events planned for today" label="description"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
  widgets: {
    title: "Add a widget",
    content: `<p>COMBO PLACEHOLDER</p>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
  },
};

const renderPages = () => {
  let pages = "";
  for (let [pageId, page] of Object.entries(pageInfo)) {
    pages += `<page-view page-id="${pageId}" title="${page.title}">
          ${page.content}
      </page-view>`;
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
    <navigation-view current-id="${
      getFieldOrder()[0] || ""
    }" page-selector="page-view">
      ${renderPages()}
    </navigation-view>
    <manifest-view current-page-id="${
      getFieldOrder()[0] || ""
    }"></manifest-view>
  </div>
`;

class AppView extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.navigationView = this.shadowRoot.querySelector("navigation-view");
    this.manifestView = this.shadowRoot.querySelector("manifest-view");

    this.currentPageIdIndex = 0;

    this.navigationView.addEventListener("next", () => this.nextPage());
    this.navigationView.addEventListener("prev", () => this.prevPage());
    this.navigationView.addEventListener("skip", () => this.skipPage());

    document.addEventListener("page-change", (e) => {
      this.updateCurrentPageAttributes();
      // Detail index is not defined when event comes from 
      // outside app-view. 
      if (e.detail.index !== undefined) {
        this.currentPageIdIndex = e.detail.index;
      } else {
        const index = getFieldOrder().indexOf(e.detail.pageId);
        this.currentPageIdIndex = index === -1 ? 0 : index;
      }
    });
    document.addEventListener("remove-node", () => {
      this.currentPageIdIndex = Math.min(
        getFieldOrder().length - 1,
        this.currentPageIdIndex
      );
      this.updateCurrentPageAttributes();
    });
  }

  updateCurrentPageAttributes() {
    this.navigationView.setAttribute(
      "current-id",
      getFieldOrder()[this.currentPageIdIndex]
    );
    this.manifestView.setAttribute(
      "current-page-id",
      getFieldOrder()[this.currentPageIdIndex]
    );
  }

  nextPage() {
    if (!this.maybeUpdateManifest()) return;

    if (this.currentPageIdIndex + 1 === getFieldOrder().length) {
      addNextUnsetFieldToManifest();
    }
    this.jumpToPage(
      Math.min(this.currentPageIdIndex + 1, getFieldOrder().length - 1)
    );
  }

  prevPage() {
    if (!this.maybeUpdateManifest()) return;
    this.jumpToPage(Math.max(0, this.currentPageIdIndex - 1));
  }

  skipPage() {
    if (this.currentPageIdIndex + 1 === getFieldOrder().length) {
      addNextUnsetFieldToManifest();
    }
    this.jumpToPage(
      Math.min(this.currentPageIdIndex + 1, getFieldOrder().length - 1)
    );
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
          pageId: getFieldOrder()[this.currentPageIdIndex],
          index: this.currentPageIdIndex,
        },
      })
    );
  }

  // To-do: Update this to use events.
  maybeUpdateManifest() {
    const pageId = getFieldOrder()[this.currentPageIdIndex];
    const pageInfoItem = pageInfo[pageId];
    const pageElement = this.shadowRoot.querySelector(
      `page-view[page-id="${pageId}"]`
    );
    let value;

    try {
      value = pageElement.getUserInput();
    } catch (e) {
      // Some fields do not have getUserInput defined. Skip those.
      return true;
    }

    let validationMessage = "";
    validationMessage = pageInfoItem.validation.fn(value);

    // we should validate non-empty values only.
    if (value === undefined || value === "") {
      validationMessage = "";
    }

    // Notify the slot that the validation succeeded or failed.
    // Some slots don't have onValidationCheck() - just see if that function
    // exists before trying to call it.
    const input = pageElement.shadowRoot
      .querySelector("slot")
      .assignedElements()[0];

    if (!input || typeof input.onValidationCheck !== "function") {
      // Skip as we can not display the error message.
      return true;
    }

    const isSuccess = validationMessage === "";
    const errorMessage = isSuccess ? "" : pageId + " " + validationMessage;
    input.onValidationCheck(isSuccess, errorMessage);

    if (isSuccess) {
      updateManifest(pageId, value);
    }

    return isSuccess;
  }
}

customElements.define("app-view", AppView);
