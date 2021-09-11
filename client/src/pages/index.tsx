import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Navbar } from "../components/Navbar";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

export const limit = 3;

const Index = () => {
  const { data, loading, fetchMore, networkStatus } = usePostsQuery();

  return (
    <div>
      <Navbar />
      <ul>
        {data?.posts?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apolloClient = initializeApollo({ headers: context.req.headers });

  await apolloClient.query({
    query: PostsDocument,
  });
  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
