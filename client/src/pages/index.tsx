import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Layout } from "../components/Layout";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

export const limit = 3;

const Index = () => {
  const { data, loading, fetchMore, networkStatus } = usePostsQuery({
    // component nao render boi cai Posts query, se rerender khi networkStatus thay doi, tuc la fetchMore
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Layout>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.map((post) => {
            return (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by User</Text>
                  <Flex align="center">
                    <Text mt={4}>{post.textSnippet}</Text>
                    <Button>Edit button</Button>
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apolloClient = initializeApollo({ headers: context.req.headers });

  const res = await apolloClient.query({
    query: PostsDocument,
    variables: {
      limit,
    },
  });
  
  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
