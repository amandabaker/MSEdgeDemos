function validateString(string) {
  // check if string is null or undefined or empty.
  if (!string) {
    return "is required";
  }

  // check if string is a string.
  if (typeof string !== "string") {
    return "must be a string";
  }

  return "";
}

function validateColor(color) {
  // check if color is null or undefined or empty.
  if (!color) {
    return "is required";
  }

  // check if color is a string.
  if (typeof color !== "string") {
    return "must be a string";
  }

  // check if color is a valid color.
  if (!color.match(/^#[0-9a-fA-F]{6}$/)) {
    return "must be a valid color";
  }

  return "";
}

function validateUrl(url) {
  // check if url is null or undefined or empty.
  if (!url) {
    return "is required";
  }

  // check if url is a string.
  if (typeof url !== "string") {
    return "must be a string";
  }

  // check if url is a valid URL.
  try {
    new URL(url);
  } catch (e) {
    return "must be a valid URL";
  }

  return "";
}

function validateBoolean(prefer) {
  // check prefer is a valid boolean.
  if (typeof prefer !== "boolean") {
    return "must be a boolean";
  }

  return "";
}

function validateIconSrc(iconSrc) {
  return validateUrl(iconSrc);
}

function validateIconSizes(iconSizes) {
  let validString = validateString(iconSizes);
  if (validString && validString.length > 0) {
    return validString;
  }

  // check if iconSizes is a valid space separated string.
  let sizes = iconSizes.split(" ");
  for (let size of sizes) {
    if (!size.match(/^\d+x\d+$/)) {
      return "Icon sizes must be space separated string of valid sizes";
    }
  }
}

function validateIconType(iconType) {
  return validateString(iconType);
}

function validateDisplayOverride(displayOverride) {
  let validString = validateString(displayOverride);
  if (validString && validString.length > 0) {
    return validString;
  }

  let validValues = [
    "fullscreen",
    "standalone",
    "minimal-ui",
    "browser",
    "window-controls-overlay",
  ];
  if (!validValues.includes(displayOverride)) {
    return "Display Overrides must be one of " + validValues.join(", ");
  }

  return "";
}

export const validateName = (name) => {
  return validateString(name);
};

export const validateStartUrl = (startUrl) => {
  return validateUrl(startUrl);
};

export const validateDisplay = (display) => {
  let validValues = ["fullscreen", "standalone", "minimal-ui", "browser"];
  if (!validValues.includes(display)) {
    return "must be one of " + validValues.join(", ");
  }

  return "";
};

export const validateShortName = (shortName) => {
  return validateString(shortName);
};

export const validateBackgroundColor = (color) => {
  return validateColor(color);
};

export const validateThemeColor = (color) => {
  return validateColor(color);
};

export const validateDescription = (description) => {
  return validateString(description);
};

export const validateIcons = (icons) => {
  for (let icon of icons) {
    let validSrc = validateIconSrc(icon.src);
    if (validSrc && validSrc.length > 0) {
      return validSrc;
    }

    let validSizes = validateIconSizes(icon.sizes);
    if (validSizes && validSizes.length > 0) {
      return validSizes;
    }

    let validType = validateIconType(icon.type);
    if (validType && validType.length > 0) {
      return validType;
    }
  }

  return "";
};

export const validateOrientation = (orientation) => {
  let validString = validateString(iconSizes);
  if (validString && validString.length > 0) {
    return validString;
  }

  let validValues = [
    "any",
    "natural",
    "landscape",
    "portrait",
    "portrait-primary",
    "portrait-secondary",
    "landscape-primary",
    "landscape-secondary",
  ];
  if (!validValues.includes(orientation)) {
    return "must be one of " + validValues.join(", ");
  }

  return "";
};

export const validatePreferRelatedApplications = (prefer) => {
  return validateBoolean(prefer);
};

export const validateScope = (scope) => {
  return validateUrl(scope);
};
