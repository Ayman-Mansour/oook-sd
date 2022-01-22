import { PostTextinput } from "src/resolvers/PostTextinput";

export const validatePostUpdate = (options: PostTextinput) => {
  var regex = /[`!@#%&()_+\-=\[\]{};':"\\|,.<>\/?~]/
  if (options.text == "") {
    return [
      {
        field: "text",
        message: "this field must not be empty",
      },
    ];
  }
  if (options.text.match(/^ *$/)) {
    return [
      {
        field: "text",
        message: "this field must not be empty",
      },
    ];
  }
  if (regex.test(options.text)) {
    return [
      {
        field: "text",
        message: "please do not use special characters or leave the field empty",
      },
    ];
  }
  return null;
};
