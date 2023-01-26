import React, {useState} from 'react';
import socketIOClient from 'socket.io-client';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import styles from "./Chat.module.scss";
import {SideBlock} from "../SideBlock";

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = socketIOClient(process.env.REACT_APP_API_URL);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('send-message', {text: message, timestamp: new Date().toLocaleString().slice(12)});
    setMessage('');
  };

  socket.on('new-message', (data) => {
    setMessages([...messages, data]);
  });

  return (
    <SideBlock title='Чат'>
      <div className={styles.chatBox}>
        {messages.map((message, index) => (
          <div key={index}>{`${message.timestamp}: ${message.text}`}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          id="outlined-basic"
          label="Введите сообщение"
          size="small"
          variant="outlined"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          size="medium"
          >
          Отправить
        </Button>
      </form>
    </SideBlock>
  );
};

export default Chat;
