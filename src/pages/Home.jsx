import React, {useEffect, useState} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";

import {Post} from "../components";
import {TagsBlock} from "../components";
import {fetchPopPosts, fetchPosts, fetchTags} from "../redux/slices/posts";
import Chat from "../components/Chat";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data)
  const {posts, tags} = useSelector(state => state.posts)
  const [tab, setTab] = useState('1')

  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'

  const handleChangeTabs = (event, newValue) => {
    setTab(newValue);
    if(tab === '2') {
      dispatch(fetchPosts());
    } else {
      dispatch(fetchPopPosts());
    }
  };

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);


  return (
    <>
      <Tabs
        style={{marginBottom: 15}}
        value={tab}
        onChange={handleChangeTabs}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" value='1'/>
        <Tab label="Популярные" value='2' />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading
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
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
            />)
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
          />
          <Chat />
        </Grid>
      </Grid>
    </>
  );
};
