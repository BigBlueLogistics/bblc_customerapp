const capitalizeWord = (text: string) => {
  if (typeof text !== "string") {
    throw new TypeError("Invalid argument it should be string.");
  }

  const textArr = text.split(" ");
  return textArr
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export default capitalizeWord;
