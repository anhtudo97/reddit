import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
  const { email, username } = registerInput;
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (!email.includes("@")) {
    return {
      message: "Invalid email",
      errors: [{ field: "email", message: "Email must include @ symbol" }],
    };
  }

  if (username.length <= 2) {
    return {
      message: "Invalid username",
      errors: [
        {
          field: "username",
          message: "Length must be greater than 2 characters",
        },
      ],
    };
  }

  if (format.test(username)) {
    return {
      message: "Invalid username",
      errors: [{ field: "email", message: "Username cannot include @ symbol" }],
    };
  }

  if (registerInput.password.length <= 2)
    return {
      message: "Invalid password",
      errors: [{ field: "password", message: "Length must be greater than 2" }],
    };

  return null;
};
