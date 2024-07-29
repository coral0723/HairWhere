import { QueryFunction } from "@tanstack/react-query";
import { Post } from "@/model/Post";

export const getLikePosts: QueryFunction<Post[], [_1: string, _2: string, _3: string]>
  = async ({queryKey}) => {
    const [_1, _2, userId] = queryKey;
    const res = await fetch(`http://localhost:9090/api/users/${userId}/likes`, {
      next: {
        tags: ['posts', 'likes', userId],
      },
      cache: 'no-store',
    });

    if(!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  }