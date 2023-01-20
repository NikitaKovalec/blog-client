import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {AddComment, Post} from "../components";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const [data, setData] = useState()
  const [commentsCount, setCommentsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const {id} = useParams()

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(res => {
        setData(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        alert('Ошибка при получении статьи, попробуйте позже')
      })
  }, [])

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4000${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={commentsCount}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      <AddComment setCommentsCount={setCommentsCount} />
    </>
  );
};
