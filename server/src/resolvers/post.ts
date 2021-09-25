// import { CheckAuth } from './../middleware/checkAuth';
import { Context } from "./../types/Context";
import { UpdatePostInput } from "./../types/UpdatePostInput";
import { PostMutationResponse } from "./../types/PostMutationResponse";
import { CreatePostInput } from "../types/CreatePostInput";
import { Post } from "./../entities/Post";
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_returns) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation((_returns) => PostMutationResponse)
  // @UseMiddleware(CheckAuth)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput
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

  @Query((_returns) => [Post])
  // @UseMiddleware(CheckAuth)
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query((_returns) => Post, { nullable: true })
  // @UseMiddleware(CheckAuth)
  async post(@Arg("id", (_type) => ID) id: number): Promise<Post | undefined> {
    try {
      const post = await Post.findOne(id);
      return post;
    } catch (error) {
      return undefined;
    }
  }

  @Mutation((_return) => PostMutationResponse)
  // @UseMiddleware(CheckAuth)
  async updatePost(
    @Arg("updatePostInput") { id, title, text }: UpdatePostInput
  ): Promise<PostMutationResponse> {
    const existingPost = await Post.findOne(id);
    if (!existingPost) {
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };
    }

    existingPost.title = title;
    existingPost.text = text;

    existingPost.save();

    return {
      code: 200,
      success: true,
      message: "Post updated successfully",
      post: existingPost,
    };
  }

  @Mutation((_return) => PostMutationResponse)
  // @UseMiddleware(CheckAuth)
  async deletePost(
    @Arg("id", (_type) => ID) id: number,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    console.log("REQ", req.session);
    const existingPost = await Post.findOne(id);
    if (!existingPost) {
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };
    }

    // if (existingPost.userId !== req.session.userId) {
    // 	return { code: 401, success: false, message: 'Unauthorised' }
    // }

    await Post.delete({ id });

    return {
      code: 200,
      success: true,
      message: "Post deleted successfully",
    };
  }
}
