import axios from "axios";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const DeleteButton = ({ id, post, setPost }) => {
  // firestore

  // const config = {
  //   apiKey: "AIzaSyDHMKHch2nFclkOZ9nUxSaaL8UwhKdGN1s",
  //   authDomain: "hajongon-todo.firebaseapp.com",
  //   projectId: "hajongon-todo",
  //   storageBucket: "hajongon-todo.appspot.com",
  //   messagingSenderId: "386379489004",
  //   appId: "1:386379489004:web:50c0ce0ead7ff15af38fc9",
  //   measurementId: "G-FEVT2YDTBJ",
  // };

  // const app = initializeApp(config);
  // const firestore = getFirestore(app);

  // const auth = getAuth();
  // const user = auth.currentUser;
  // const userId = user.uid;

  // userlist라는 콜렉션 아래 userId doc 아래 todos 라는 문서 참조
  // const todosRef = collection(firestore, "userlist", userId, "todos");

  // const handleClick = async () => {
  // const deleteDiscussion = async () => {
  // console.log(index);
  // const response = await axios.delete(
  //   `http://15.164.216.204:4000/list/${index}`
  // );
  // console.log(response.data);
  // const todosSnapshot = await getDoc(todosRef);
  // if (todosSnapshot.exists()) {
  //   const todos = todosSnapshot.data();
  //   console.log(todos);

  //   console.log(post[0].id);
  //   const filtered = todos.filter((el) => {
  //     return el.id !== index;
  //   });

  //   setPost(filtered);
  //   await updateDoc(todosRef, { todos: filtered });
  // } else {
  //   throw new Error("없어");
  // }
  // console.log(index);
  // const userDocRef = doc(firestore, "userlist", userId);
  // getDoc(userDocRef).then((docSnapshot) => {
  //   if (!docSnapshot.exists()) {
  //     // userDocRef에서 받은 값이 없으면 todos라는 이름의 빈 배열 생성
  //     setDoc(userDocRef, { todos: [] });
  //   } else {
  //     const todoRef = doc(userDocRef, "todos", index);
  //     deleteDoc(todoRef);
  //   }
  // });

  // };
  // await deleteDiscussion();

  // const getPost = async () => {
  //   const response = await axios.get(`http://15.164.216.204:4000/list`);
  //   const copy = response.data;
  //   console.log(copy);
  //   setPost(copy);
  // };
  // getPost();
  // };

  return (
    <FontAwesomeIcon
      className="fa-trash-can"
      icon={faTrashCan}
    ></FontAwesomeIcon>
  );
};
