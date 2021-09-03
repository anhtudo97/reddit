import { CreatePostInput } from '../types/CreatePostInput';
import { Post } from "./../entities/Post";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Mutation((_returns) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput,
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Post created successfully",
        post: newPost,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }
}
