export default function postForm<T>(path: string, params: T) {
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
    hiddenField.setAttribute("value", params[key] as any);
    form.appendChild(hiddenField);
  }

  console.log(form);
  document.body.appendChild(form);
  form.submit();
}
