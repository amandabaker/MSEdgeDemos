const defaultManifestJson = {
  name: "manifest-generator",
  short_name: "manifest-generator",
  start_url: "/",
  display: "standalone",
  background_color: "#fff",
  theme_color: "#fff",
  description: "A simple tool to generate a web app manifest",
  icons: [
    {
      src: "https://manifest-gen.now.sh/static/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "https://manifest-gen.now.sh/static/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  categories: [],
  display_override: [],
  file_handlers: [],
  id: "",
  orientation: "any",
  prefer_related_applications: false,
  related_applications: "",
  protocol_handlers: [],
  scope: "",
  screenshot: [],
  share_target: {},
  shortcut: {},
  widgets: {},
};

const defaultFieldOrder = ["name"];

const defaultUnsetFieldList = [
  "short_name",
  "start_url",
  "display",
  "background_color",
  "theme_color",
  "description",
  "icons",
  "prefer_related_applications",
  "categories",
  "display_override",
  "file_handlers",
  "id",
  "orientation",
  "related_applications",
  "protocol_handlers",
  "scope",
  "screenshot",
  "share_target",
  "shortcut",
  "widgets",
];

// This contains all of the possible manifest fields and their state.
let manifestState = {};
// These are all the unset fields that users can add to.
let unsetFieldListState = [];
// This tracks the order of fields in the manifest.json.
let fieldOrderState = [];

// Read (Get) entire object from LocalStorage.
// Other places can use this as:
// const state = getManifest();
// state.name ...
export const getManifest = () => {
  return structuredClone(manifestState);
};

export const getUnsetFields = () => {
  return structuredClone(unsetFieldListState);
};

export const getFieldOrder = () => {
  return structuredClone(fieldOrderState);
};

export const addNextUnsetFieldToManifest = () => {
  addFieldToManifest(getUnsetFields()[0]);
};

export const addFieldToManifest = (key) => {
  if (fieldOrderState.includes(key)) return;
  const index = unsetFieldListState.findIndex((fieldKey) => fieldKey === key);
  if (index === -1) return;
  unsetFieldListState.splice(index, 1);
  fieldOrderState.push(key);
  localStorage.setItem("unsetFieldList", JSON.stringify(unsetFieldListState));
  localStorage.setItem("fieldOrder", JSON.stringify(fieldOrderState));
};

export const removeFieldFromManifest = (key) => {
  if (unsetFieldListState.includes(key)) return;
  const index = fieldOrderState.findIndex((fieldKey) => fieldKey === key);
  if (index === -1) return;
  unsetFieldListState.push(key);
  fieldOrderState.push(key);
  localStorage.setItem("unsetFieldList", JSON.stringify(unsetFieldListState));
  localStorage.setItem("fieldOrder", JSON.stringify(fieldOrderState));
};

export const updateManifest = (key, value) => {
  const manifest = getManifest();
  manifest[key] = value;
  setManifest(manifest);
};

// Write (Set) entire object LocalStorage.
// Other places can use this as:
// let state = getManifest();
// state.name = "new value";
// setManifest(state);
const setManifest = (newState) => {
  if (newState == manifestState) {
    return;
  }

  document.dispatchEvent(
    new CustomEvent("manifest-change", {
      detail: {
        oldManifest: manifestState,
        manifest: newState,
      },
    })
  );

  manifestState = newState;
  localStorage.setItem("manifest", JSON.stringify(newState));
};

export const readDataFromLocalStorage = () => {
  const manifestString = localStorage.getItem("manifest");
  manifestState = manifestString
    ? JSON.parse(manifestString)
    : defaultManifestJson;
  const unsetFieldListValue = localStorage.getItem("unsetFieldList");
  unsetFieldListState = unsetFieldListValue
    ? JSON.parse(unsetFieldListValue)
    : defaultUnsetFieldList;
  const fieldOrderValue = localStorage.getItem("fieldOrder");
  fieldOrderState = fieldOrderValue
    ? JSON.parse(fieldOrderValue)
    : defaultFieldOrder;
};

export const copyManifest = () => {
  const manifestState = getManifest();
  getUnsetFields().forEach((field) => {
    delete manifestState[field];
  });
  navigator.clipboard.writeText(JSON.stringify(manifestState));
};
