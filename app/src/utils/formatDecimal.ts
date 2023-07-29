const formatDecimal = (value: number, decimal: number = 2) => {
  if (typeof value !== "number") {
    throw new TypeError("Invalid type it should be number");
  }
  if (typeof decimal !== "number") {
    throw new TypeError("Invalid decimal it should be number");
  }
  return Number(parseFloat(value.toString()).toFixed(2)).toLocaleString("en", {
    minimumFractionDigits: decimal,
  });
};

export default formatDecimal;
