// TODO: shorten this after implementing the manifest generator
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

const defaultUnsetFields = [
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

let manifestState = {};
let unsetFieldsState = {};

// Read (Get) entire object from LocalStorage.
// Other places can use this as:
// const state = getManifest();
// state.name ...
export const getManifest = () => {
  return structuredClone(manifestState);
};

export const getUnsetFields = () => {
  return structuredClone(unsetFieldsState);
};

export const addFieldToManifest = (key) => {
  const index = unsetFieldsState.findIndex((fieldKey) => fieldKey === key);
  unsetFieldsState.splice(index, 1);
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

export const readManifestFromLocalStorage = () => {
  const manifestString = localStorage.getItem("manifest");
  manifestState = manifestString
    ? JSON.parse(manifestString)
    : defaultManifestJson;
  const unsetFieldsValue = localStorage.getItem("unsetFields");
  unsetFieldsState = unsetFieldsValue
    ? JSON.parse(unsetFieldsValue)
    : defaultUnsetFields;
};
