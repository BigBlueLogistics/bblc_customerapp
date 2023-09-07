import { format, isValid } from "date-fns";

const initialOpts = {
  format: "MM/dd/yyyy, hh:mm a",
  defaultValue: null,
};

type TOpts = Partial<typeof initialOpts>;

function formatDate(date: string | Date | number, options: TOpts = initialOpts) {
  let dateValue = date;
  const opt = { ...initialOpts, ...options };
  if (dateValue && typeof dateValue === "string") {
    dateValue = new Date(dateValue);
  }

  if (dateValue && isValid(dateValue)) {
    return format(dateValue as Date | number, opt.format);
  }

  return opt.defaultValue || dateValue;
}

export default formatDate;
