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
import "./multi-string-block-form.js";
import "./simple-text-input.js";

import * as validations from "../validation.js";

import {
  addNextUnsetFieldToManifest,
  getFieldOrder,
  getManifest,
  updateManifest,
} from "../state.js";

const manifest = getManifest();

const stringifyAndEncode = (value) => {
  return encodeURIComponent(JSON.stringify(value));
};

const pageInfo = {
  name: {
    title: "What's your app's name?",
    content: `<simple-text-input placeholder-text="App name" value="${manifest.name}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateName,
    },
    tooltipTitle: "The name of the web application",
    tooltipContent:
      "The name member is a string that represents the name of the web application as it is usually displayed to the user (e.g., amongst a list of other applications, or as a label for an icon).",
  },
  short_name: {
    title: "Now give it a nice short name",
    content: `<simple-text-input placeholder-text="Short name" value="${manifest.short_name}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateShortName,
    },
    tooltipTitle: "The short name of the web application",
    tooltipContent:
      "The short_name member is a string that represents the name of the web application displayed to the user if there is not enough space to display name (e.g., as a label for an icon on the phone home screen).",
  },
  start_url: {
    title: "Give me a start url",
    content: `<simple-text-input placeholder-text="Start url" value="${manifest.start_url}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateStartUrl,
    },
    tooltipTitle: "The start URL of the web application",
    tooltipContent:
      "The start_url member is a string that represents the start URL of the web application — the preferred URL that should be loaded when the user launches the web application (e.g., when the user taps on the web application's icon from a device's application menu or homescreen).",
  },
  display: {
    title: "Set a display mode",
    content: `<display-mode value="${manifest.display}"></display-mode>`,
    validation: {
      type: "string",
      fn: validations.validateDisplay,
    },
    tooltipTitle: "The display mode of the web application",
    tooltipContent:
      "The display member is a string that determines the developers’ preferred display mode for the website. The display mode changes how much of browser UI is shown to the user and can range from browser (when the full browser window is shown) to fullscreen (when the app is full-screened).",
  },
  background_color: {
    title: "Pick a background color",
    content: `<color-picker value="${manifest.background_color}"></color-picker>`,
    validation: {
      type: "string",
      fn: validations.validateBackgroundColor,
    },
    tooltipTitle: "The background color of the web application",
    tooltipContent:
      "The background_color member defines a placeholder background color for the application page to display before its stylesheet is loaded. This value is used by the user agent to draw the background color of a shortcut when the manifest is available before the stylesheet has loaded.",
  },
  theme_color: {
    title: "Pick a theme color",
    content: `<color-picker value="${manifest.theme_color}"></color-picker>`,
    validation: {
      type: "string",
      fn: validations.validateThemeColor,
    },
    tooltipTitle: "The theme color of the web application",
    tooltipContent:
      "The theme_color member defines the default theme color for the application. This sometimes affects how the OS displays the site (e.g., on Android's task switcher, the theme color surrounds the site).",
  },
  description: {
    title: "Provide a description of your app",
    content: `<long-text-input placeholder-text="Description" value="${manifest.description}"></long-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateDescription,
    },
    tooltipTitle: "The description of the web application",
    tooltipContent:
      "The description member is a string that describes the web application to the user. This description may be used by search engines when displaying search results.",
  },
  icons: {
    title: "Choose your icons",
    content: `
        <multi-block-form max-number-of-blocks="3" fields="${stringifyAndEncode(
          ["src", "sizes", "type"]
        )}" value="${stringifyAndEncode([
          { src: "/", sizes: "200x200", type: "png" },
        ])}">
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
    tooltipTitle: "The icons of the web application",
    tooltipContent:
      "The icons member is an array of image objects that represent icon images. The minimum requirement is one icon of size 192x192px, and at least one icon of size 512x512px is recommended.",
  },
  categories: {
    title: "Specify categories that your app belongs to",
    content: `
        <multi-string-block-form max-number-of-blocks="10" value="${manifest.categories}">
        </multi-string-block-form>`,
    validation: {
      type: "array",
      fn: validations.validateCategories,
    },
    tooltipTitle: "The categories that the web application belongs to",
    tooltipContent:
      "The categories member is an array of strings defining the names of categories that the application supposedly belongs to. The set of categories is not standardized and can vary between different app stores. A list of commonly used categories can be found at https://github.com/w3c/manifest/wiki/Categories",
  },
  display_override: {
    title: "Choose your display overrides",
    title: "Display Override",
    content: `
        <multi-string-block-form max-number-of-blocks="5" value="${manifest.display_override}">
        </multi-string-block-form>`,
    validation: {
      type: "array",
      fn: validations.validateDisplayOverride,
    },
    tooltipTitle: "The display override of the web application",
    tooltipContent:
      "The display_override member is a string that defines the developers’ preferred display mode for the website. The display mode changes how much of browser UI is shown to the user and can range from browser (when the full browser window is shown) to fullscreen (when the app is full-screened).",
  },
  file_handlers: {
    title: "Specify the types of files your app handle?",
    content: `<p>TBD</p>`,
    validation: {
      type: "array",
      fn: () => "",
    },
    tooltipTitle: "The file handlers of the web application",
    tooltipContent:
      "The file_handlers member is an array of objects defining handlers for various file types.",
  },
  id: {
    title: "Choose an ID",
    content: `<simple-text-input placeholder-text="ID" value="${manifest.id}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: () => "",
    },
    tooltipTitle: "The ID of the web application",
    tooltipContent:
      "The id member is a string that represents the developer's preferred ID for the web application. This ID may be used in various APIs' identifiers (e.g., in the Push API).",
  },
  orientation: {
    title: "Choose an orientation",
    content: `<radio-buttons value="${manifest.orientation}" options="any,natural,landscape,landscape-primary,landscape-secondary,portrait,portrait-primary,portrait-secondary"></radio-buttons>`,
    validation: {
      type: "string",
      fn: validations.validateOrientation,
    },
    tooltipTitle: "The orientation of the web application",
    tooltipContent:
      "The orientation member is a string that defines the default orientation for all the website's top-level browsing contexts.",
  },
  prefer_related_applications: {
    title:
      "Would you prefer to guide users to install a related application from an app store?",
    content: `<radio-buttons value="${manifest.prefer_related_applications}" options="true,false"></radio-buttons>`,
    validation: {
      type: "bool",
      fn: validations.validatePreferRelatedApplications,
    },
    tooltipTitle: "The prefer_related_applications of the web application",
    tooltipContent:
      "The prefer_related_applications member is a boolean that specifies that applications listed in related_applications should be preferred over the website. If this is set to true and the user has one or more related applications installed, the user agent should promote the related applications above the website when launching the web application.",
  },
  related_applications: {
    title: "Set your related applications, if any",
    content: `
        <multi-block-form fields="${stringifyAndEncode([
          "platform",
          "url",
          "id",
        ])}" value="${stringifyAndEncode([{ platform: "", url: "", id: "" }])}">
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
    tooltipTitle: "The related applications of the web application",
    tooltipContent:
      "The related_applications member is an array of application objects that declare the web application to be part of a package of other applications. This allows the user agent to recommend related applications to the user after it has been installed.",
  },
  protocol_handlers: {
    title: "Set your protocol handlers",
    content: `
        <multi-block-form fields="${stringifyAndEncode([
          "protocol",
          "url",
        ])}" value="${stringifyAndEncode([{ protocol: "", url: "" }])}">
          <div slot="form">
            <simple-text-input field-id="protocol" placeholder="web+customProtocol" label="protocol"></simple-text-input>
            <simple-text-input field-id="url" placeholder="web+customProtocol" label="url"></simple-text-input>
          </div>
        </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
    tooltipTitle: "The protocol handlers of the web application",
    tooltipContent:
      "The protocol_handlers member is an array of objects that define URL schemes of potential external applications that will be able to handle links from the web application.",
  },
  scope: {
    title: "Choose a scope",
    content: `<simple-text-input placeholder-text="Scope" value="${manifest.scope}"></simple-text-input>`,
    validation: {
      type: "string",
      fn: validations.validateScope,
    },
    tooltipTitle: "The scope of the web application",
    tooltipContent:
      "The scope member is a string that defines the navigation scope of this web application's application context. It restricts what web pages can be viewed while the manifest is applied. If the user navigates outside the scope, it reverts to a normal web page inside a browser tab or window.",
  },
  screenshots: {
    title: "Add screenshots",
    content: `
        <multi-block-form fields="${stringifyAndEncode([
          "src",
          "sizes",
          "type",
          "form_factor",
          "label",
        ])}" value="${stringifyAndEncode([
          { src: "", sizes: "", type: "", form_factor: "", label: "" },
        ])}">
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
    tooltipTitle: "The screenshots of the web application",
    tooltipContent:
      "The screenshots member is an array of objects that define screenshots of the web application. These images are intended to be used by progressive web app stores.",
  },
  share_target: {
    title: "Add a share target",
    content: `
    <multi-block-form fields="${stringifyAndEncode([
      "action",
      "enctype",
      "method",
      "params",
    ])}" value="${stringifyAndEncode([
      {
        action: "",
        enctype: "",
        method: "",
        params: [
          {
            title: "",
            text: "",
            url: "",
            files: [
              {
                name: "",
                accept: [],
              },
            ],
          },
        ],
      },
    ])}">
      <div slot="form">
        <simple-text-input field-id="action" placeholder="/shared-content-receiver/" label="action"></simple-text-input>
        <simple-text-input field-id="enctype" placeholder="multipart/form-data" label="enctype"></simple-text-input>
        <simple-text-input field-id="method" placeholder="GET" label="method"></simple-text-input>
        <p>params</p>
        <multi-block-form field-id="params" fields="${stringifyAndEncode([
          "title",
          "text",
          "url",
          "files",
        ])}" value="${stringifyAndEncode([
          {
            title: "",
            text: "",
            url: "",
            files: [
              {
                name: "",
                accept: [],
              },
            ],
          },
        ])}">
          <div slot="form">
            <simple-text-input field-id="title" placeholder="web+customProtocol" label="title""></simple-text-input>
            <simple-text-input field-id="text" placeholder="web+customProtocol" label="text""></simple-text-input>
            <simple-text-input field-id="url" placeholder="web+customProtocol" label="url""></simple-text-input>
            <p>files</p>
            <multi-block-form field-id="files" fields="${stringifyAndEncode([
              "name",
              "accept",
            ])}" value="${stringifyAndEncode([
              {
                name: "",
                accept: [],
              },
            ])}">
              <div slot="form">
                <simple-text-input field-id="name" placeholder="lists" label="name""></simple-text-input>
                <p>accept</p>
                <multi-string-block-form max-number-of-blocks="5" field-id="accept" label="accept" value="">
                </multi-string-block-form>
              </div>
            </multi-block-form>
          </div>
        </multi-block-form>
      </div>
    </multi-block-form>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
    tooltipTitle: "The share target of the web application",
    tooltipContent:
      "The share_target member is an object that defines a target on which to trigger a share action. This object is a dictionary whose keys describe the share target parameters. The value of each key is itself a dictionary that defines the parameters for a specific share target.",
  },
  shortcuts: {
    title: "Add shortcuts",
    content: `
        <multi-block-form fields="${stringifyAndEncode([
          "name",
          "url",
          "description",
        ])}" value="${stringifyAndEncode([
          { name: "", url: "", description: "" },
        ])}">
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
    tooltipTitle: "The shortcuts of the web application",
    tooltipContent:
      "The shortcuts member is an object that defines shortcuts to particular web pages or web functionality in the application. This object is a dictionary whose keys are the names of the shortcuts and whose values are dictionaries themselves. The values define the URL of the shortcut and the name of the shortcut.",
  },
  widgets: {
    title: "Add some widgets",
    content: `<p>COMBO PLACEHOLDER</p>`,
    validation: {
      type: "array",
      // TODO: add validation once combo implemented.
      fn: () => "",
    },
    tooltipTitle: "The widgets of the web application",
    tooltipContent:
      "The widgets member is an object that defines a widget configuration. This object is a dictionary whose keys describe the widget configuration parameters. The value of each key is itself a dictionary that defines the parameters for a specific widget configuration.",
  },
};

const renderPages = () => {
  let pages = "";
  for (let [pageId, page] of Object.entries(pageInfo)) {
    pages += `
    <page-view
      page-id="${pageId}"
      title="${page.title}"
      tooltip-title="${page.tooltipTitle}"
      tooltip-content="${page.tooltipContent}"
    >
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
      // Inputs other than simple text and long text (e.g. color picker)
      // Doesn't need validation
      updateManifest(pageId, value);
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
