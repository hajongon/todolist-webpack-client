import React from "react";
import { useState } from "react";
import { StyledSubmit } from "./styles/StyledSubmit";
import styled from "styled-components";

import "./Submit.css";
import axios from "axios";
import { FieldValue } from "firebase/firestore";
import {
  Firestore,
  addDoc,
  setDoc,
  getDoc,
  doc,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

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

const Submit = ({ post, setPost, firestore }) => {
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
    if (title.length === 0) return;

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;

    // userlist라는 콜렉션 아래 userId doc 아래 todos 라는 문서 참조
    const todosRef = collection(firestore, "userlist", userId, "todos");

    // 새로운 항목
    const newTodo = { title: title };

    // 위에서 참조한 todosRef라는 문서에 newTodo 추가
    const docRef = await addDoc(todosRef, newTodo);
    const docId = docRef.id;

    // console.log(docId);

    // post 최신화
    // firestore 항목 id 넣어주기
    const added = { id: docId, title: title };
    setPost((prev) => [added, ...prev]);
    localStorage.setItem("posts", JSON.stringify(post));
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
      <button className="submit-button" type="submit" onClick={handleSubmit}>
        add
      </button>
    </StyledSubmit>
  );
};

export default Submit;
