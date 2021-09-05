import React from "react";
import { Formik, Form } from "formik";
import { FormControl, FormLabel, Button, Box } from "@chakra-ui/react";
import { Wapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";

function Register() {
  return (
    <Wapper>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={() => console.log("123")}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <InputField
                label="username"
                name="username"
                placeholder="Username"
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
                Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wapper>
  );
}

export default Register;
