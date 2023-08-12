export default function postForm(
  path: string,
  params: { [key: string]: string }
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

  console.log(form);
  document.body.appendChild(form);
  form.submit();
}

interface ParamsDataProps {
  [key: string]: string | number;
}
export function convertObjectDataToString(paramsData: ParamsDataProps) {
  let stringifiedObjectValues: { [key: string]: string } = {};
  for (let key in paramsData) {
    stringifiedObjectValues[key] = paramsData[key].toString();
  }
  return stringifiedObjectValues;
}
