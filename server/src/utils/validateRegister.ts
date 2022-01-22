import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  var phoneno = /^\d{10}$/;

  if (!options.email.includes("@") && !options.email.includes(".co")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (options.username.length <= 5) {
    return [
      {
        field: "username",
        message: "length must be greater than 5",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }
  if( !options.phone.match(phoneno) ) {
    return [
      {
        field: "phone",
        message: "wrong phone number",
      },
    ];
  }

  if (options.phone.length > 10 || options.phone.length < 10 || !options.phone.match(phoneno) ) {
    return [
      {
        field: "phone",
        message: "wrong phone number",
      },
    ];
  }
  if (options.password.length <= 5) {
    return [
      {
        field: "password",
        message: "length must be greater than 5",
      },
    ];
  }
  if (options.role == "") {
    return [
      {
        field: "role",
        message: "you must choise : editor or reviewer",
      },
    ];
  }

  return null;
};
