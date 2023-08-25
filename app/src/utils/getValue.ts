const getValue = (value: any, defaultValue: any = null) => {
  if (value) {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  }

  return defaultValue;
};

export default getValue;
