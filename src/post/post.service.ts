import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

const posts: Post[] = [];

@Injectable()
export class PostService {
  create(createPostDto: CreatePostDto) {
    const post: Post = {
      id: posts.length === 0 ? 1 : posts[posts.length - 1].id + 1,
      createdAt: new Date(),
      ...createPostDto,
    };

    posts.push(post);
    return post;
  }

  findAll() {
    console.log('findAll');
    return posts;
  }

  findOne(id: number) {
    return posts.find((post) => post.id === id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      return null;
    }
    const updatedPost = { ...posts[postIndex], ...updatePostDto };
    posts[postIndex] = updatedPost;
    return updatedPost;
  }

  remove(id: number) {
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      return null;
    }
    const deletedPost = posts[postIndex];
    posts.splice(postIndex, 1);
    return deletedPost;
  }
}
