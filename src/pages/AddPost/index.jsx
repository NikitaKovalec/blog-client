import React, {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {selectIsAuth} from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]

      formData.append('image', file)
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (e) {
      console.log('Ошибка при отправке на сервер', e)
      alert('Произошла ошибка при отправке файла, попробуйте позже')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title,
        imageUrl,
        tags: tags ? tags : '',
        text,
      }

      const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)

    } catch (e) {
      console.log('Ошибка при при создании статьи', e)
      alert('Произошла ошибка при создании статьи')
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
        .then(({data}) => {
          setTitle(data.title)
          setText(data.text)
          setTags(data.tags.join(','))
          setImageUrl(data.imageUrl)
        })
        .catch((e) => {
          console.log('Ошибка загрузки статьи с сервера', e)
          alert('Ошибка загрузки статьи с сервера')
        })
    }
  }, [])

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper style={{padding: 30}}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4000${imageUrl}`} alt="Uploaded"/>
        </>
      )}
      <br/>
      <br/>
      <TextField
        classes={{root: styles.title}}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{root: styles.tags}}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth/>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Редактировать' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
