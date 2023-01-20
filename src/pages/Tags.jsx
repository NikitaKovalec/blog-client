import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Post} from "../components";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "../axios";
import styles from "../components/Post/Post.module.scss";

const Tags = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector(state => state.auth.data)
  const {tag} = useParams()

  useEffect(() => {
    axios.get(`/tags/${tag}`).then(res => {
      setPosts(res.data)
      setIsLoading(false)
    }).catch(err => {
      console.log(err)
      alert('Ошибка при получении статьи, попробуйте позже')
    })
  }, [])

  return (
    <>
      <h1 className={styles.title}>Статьи под тегом: #{tag}</h1>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {(isLoading ? [...Array(5)] : posts).map((obj, index) => isLoading
            ? <Post
              key={index}
              isLoading={true}
            />
            : (<Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />)
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Tags;