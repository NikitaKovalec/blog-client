import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "../../axios";

import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {selectIsAuth} from "../../redux/slices/auth";

export const AddComment = ({setCommentsCount}) => {
  const {id} = useParams()
  const isAuth = useSelector(selectIsAuth)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    axios.get(`/posts/${id}/comments`)
      .then(res => {
        setComments(res.data)
        setCommentsCount(comments.length)
      })
      .catch(err => {
        console.log(err)
      })
  }, [id, comments])

  const commentData = {
    post: id,
    content: commentText ? commentText : null,
  }

  const sendComment = () => {
    if (isAuth) {
      axios.post(`/posts/${id}/comments`, commentData)
        .then(res => {
          setComments([res.data, ...comments])
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setCommentText('')
        })
    }
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.form}>
          <div className={styles.wrapper}>{comments ? comments.map((obj) =>
            <div className={styles.comment__wrapper}>
              <p className={styles.comment}>{obj.content}</p>
              <p className={styles.date}>{obj.createdAt}</p>
            </div>
          ) : <h3>Нет комментариев</h3>}</div>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            onChange={event => setCommentText(event.target.value)}
            value={commentText}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button disabled={!isAuth} onClick={sendComment} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
