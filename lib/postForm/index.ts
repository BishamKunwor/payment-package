export default function postForm<T>(
  path: string,
  params: { [key in keyof T]: string }
) {
  if (typeof window === "undefined") {
    throw new Error("Cannot Initiate Payment In Node Environment.");
  }

  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", path);

  for (let key in params) {
    let hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
}

type ConversionProps<T> = {
  [key in keyof T]: string | number;
};

type StringifiedObj<T> = {
  [key in keyof T]: string;
};

export function convertObjectDataToString<T>(paramsData: ConversionProps<T>) {
  let stringifiedObjectValues = {} as StringifiedObj<T>;
  for (let key in paramsData) {
    stringifiedObjectValues[key] = paramsData[key].toString();
  }
  return stringifiedObjectValues;
}
