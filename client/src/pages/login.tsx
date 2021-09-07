import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { LoginInput, useLoginMutation } from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { useRouter } from "next/dist/client/router";

const Login = () => {
  const router = useRouter();
  const initialValues: LoginInput = { usernameOrEmail: "", password: "" };

  const [loginUser, { loading: _loginUserLoading, error }] = useLoginMutation();

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
    });

    if (response.data?.login?.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else {
      router.push("/");
    }
  };

  return (
    <Wapper>
      {error && <p>Failed to login. Internal server error</p>}
      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username or email"
              label="Username or email"
              type="text"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wapper>
  );
};

export default Login;
