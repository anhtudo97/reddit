import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

interface PostEditDeleteButtonsProps {
  postId: string;
  postUserId: string;
}

export const PostEditDeleteButtons: React.FC<PostEditDeleteButtonsProps> = ({
  postId,
  postUserId,
}) => {
  const router = useRouter();
  const { data: meData } = useMeQuery();

  const [deletePost, _] = useDeletePostMutation();

  const onPostDelete = async (postId: string) => {
    await deletePost({
      variables: { id: postId },
      // update(cache, {data}){
      //     if(data?.deletePost.success){
      //         cache.modify({

      //         })
      //     }
      // }
    });

    if (router.route !== "/") router.push("/");
  };

//   if (meData?.me?.id !== postUserId) return null;

  return (
    <Box>
      <NextLink href={`post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>

      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete"
        colorScheme="red"
        onClick={onPostDelete.bind(this, postId)}
      />
    </Box>
  );
};