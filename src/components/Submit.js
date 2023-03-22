import React from "react";
import { useState } from "react";
import { StyledSubmit } from "./styles/StyledSubmit";
import styled from "styled-components";

import "./Submit.css";
import axios from "axios";

const ToDo = styled.textarea`
  width: 90%;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px 20px 10px 20px;
`;

const Submit = ({ post, setPost }) => {
  const [title, setTitle] = useState("");

  const todoHandler = (e) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (event) => {
    // event.key === 'enter' 로 했을 때 한글 입력시 두개가 등록되는 현상
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title) return;
    const data = await axios.post("http://localhost:4000/list", {
      title: title,
    });

    // post 요청에서 새로운 배열을 보내주기 때문에 다시 get할 필요가 없다.
    
    // const getPost = async () => {
    //   const response = await axios.get('http://localhost:4000/list');
    //   const copy = response.data;
    //   setPost(copy);
    // };
    // getPost();

    console.log(data.data);
    const newPost = data.data;
    setPost(newPost);
    setTitle("");
  };

  return (
    <StyledSubmit onSubmit={handleSubmit}>
      <div>What do you wanna do?</div>
      <ToDo
        onChange={todoHandler}
        onKeyDown={handleKeyDown}
        placeholder="text here"
        value={title}
      />
      <button className="tiny-button" type="submit" onClick={handleSubmit}>
        add
      </button>
    </StyledSubmit>
  );
};

export default Submit;
