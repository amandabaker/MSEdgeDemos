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

function validateBoolean(boolean) {
  // check prefer is a valid boolean.
  if (typeof prefer !== "boolean") {
    return "must be a boolean";
  }

  return "";
}

function validateName(name) {
  return validateString(name);
}

function validateStartUrl(startUrl) {
  return validateUrl(startUrl);
}

function validateDisplay(display) {
  let validValues = ["fullscreen", "standalone", "minimal-ui", "browser"];
  if (!validValues.includes(display)) {
    return "Display must be one of " + validValues.join(", ");
  }

  return "";
}

function validateIconSrc(iconSrc) {
  // check if iconSrc is null or undefined or empty.
  if (!iconSrc) {
    return "Icon src is required";
  }

  // check if iconSrc is a string.
  if (typeof iconSrc !== "string") {
    return "Icon src must be a string";
  }
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

function validateDescription(description) {
  return validateString(description);
}

function validateShortName(shortName) {
  return validateString(shortName);
}

function validateBackgroundColor(color) {
  return validateColor(color);
}

function validateThemeColor(color) {
  return validateColor(color);
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

function validateOrientation(orientation) {
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
}

function validatePreferRelatedApplications(prefer) {
  return validateBoolean(prefer);
}

function validateScope(scope) {
  return validateUrl(scope);
}
