import router from "next/router";
import NextLink from "next/link";

import { useCheckAuth } from "../utils/useCheckAuth";
import { Flex, Spinner, Box, Button } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { CreatePostInput, useCreatePostMutation } from "../generated/graphql";

const CreatePost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues = { title: "", text: "" };

  const [createPost, _] = useCreatePostMutation();

  const onCreatePostSubmit = async (values: CreatePostInput) => {
    await createPost({
      variables: { createPostInput: values },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(existing) {
              if (data?.createPost.success && data.createPost.post) {
                const newPostRef = cache.identify(data.createPost.post);

                const newPostsAfterCretion = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedPosts: [
                    { __ref: newPostRef },
                    ...existing.paginatedPosts,
                  ],
                };

                return newPostsAfterCretion;
              }
            },
          },
        });
      },
    });
    router.push("/");
  };

  if (authLoading || (!authLoading && !authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Layout>
      <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title"
              label="Title"
              type="text"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="Text"
                label="Text"
                type="textarea"
              />
            </Box>
            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Create a new post
              </Button>
              <NextLink href="/">
                <Button>Go back to Home</Button>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
