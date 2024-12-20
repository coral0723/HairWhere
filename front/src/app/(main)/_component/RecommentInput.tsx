"use client"

import style from './recommentInput.module.css';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from 'antd';
import { useSession } from "next-auth/react";
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useRouter} from "next/navigation";
import { Comment } from '@/model/Comment';

type Props = {
  id: string,
  parentId: string
}

export default function RecommentInput({id, parentId}: Props) {
  const queryClient = useQueryClient();
  const { data: me } = useSession(); 
  const [text, setText] = useState<string>("");
  const router = useRouter();

  const addComment = useMutation({
    mutationFn: () => {
      return fetch(`/comment/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
          parentId: Number(parentId)
        }),
      })
    }, 
    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if(queryKey[0] === "recomment" && queryKey[1] === id && queryKey[2] === parentId) {
          const value: Comment[] | undefined = queryClient.getQueryData(queryKey);
          const shallow = value ? [...value] : [];
          const newComment:Comment = {
            id: shallow.length === 0 ? 1: shallow[shallow.length-1].id + 1,
            content: text,
            user: {
              loginId: me?.user?.id || '',
              name: me?.user?.name || '',
              profilePath: me?.user?.image || '',
              email: me?.user?.email || ''
            },
            parentId: Number(parentId),
            replies: [],
            createdAt: new Date()
          };
          shallow.unshift(newComment);
          queryClient.setQueryData(queryKey, shallow);
        }
      })
    },
    onSuccess() {
      setText('');
      queryClient.invalidateQueries({queryKey: ['comments', id]});
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
    }
  })

  const onAddComment = () => {
    if(!me) {
      router.push('/login');
      return;
    } else {
      addComment.mutate();
      return;
    }
  }

  return (
    <>
      <div className={style.commentInput}>
          { me && me?.user?.image ?
            <Avatar src={me?.user?.image} className={style.profile}/>
            : <Avatar icon={<UserOutlined/>} className={style.profile}/>
          }
          <Textarea 
            className={style.textArea} 
            placeholder="댓글 작성..."
            spellCheck={false}
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
          { text && <button className={style.commentButton} onClick={onAddComment}>등록</button> }
        </div>
    </>
  )
}