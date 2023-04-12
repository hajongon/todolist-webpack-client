import styled from "styled-components";
import { StyledList } from "./styles/StyledList";

import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faBars,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import firestore from "../firebase";

import "./List.css";

const DeleteButton = styled(FontAwesomeIcon)``;

export const List = ({
  post,
  setPost,
  setBearSmile,
  count,
  setCount,
  userId,
  todosRef,
  todos,
  checkedList,
  setCheckedList,
}) => {
  const [isEditing, setIsEditing] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const [draggingIndex, setDraggingIndex] = useState(null);
  // 드래그 지나간 자리 표시
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // const [userId, setUserId] = useState(null);
  // const [todoRef, setTodoRef] = useState(null);

  // 드래그하고 있는 대상 css 변경
  // 드래그로 놓을 수 있는 위치 css 변경
  // 수정 버튼 왼쪽에 햄버거 아이콘 넣어서 드래그할 수 있다는 느낌

  // useEffect(() => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   const id = user.uid;
  //   setUserId(id);
  //   const ref = doc(firestore, "userlist", userId, "todos", id);
  //   setTodoRef(ref);
  // });

  useEffect(() => {
    // 로컬 스토리지에서 checkedList 값을 가져와서 적용
    const storedCheckedList = localStorage.getItem("checkedList");
    if (storedCheckedList) {
      setCheckedList(JSON.parse(storedCheckedList));
    }
  }, []);

  const handleDragStart = (e, index) => {
    // 드래그 하면 드래그되는 요소의 인덱스를 데이터로 설정한다.
    // "text/plain"은 데이터 타입.
    e.dataTransfer.setData("text/plain", index);
    // drag하고 있는 요소의 인덱스 추출
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e, targetIndex) => {
    // 클래스 빼기
    setDraggingIndex(null);
    setDragOverIndex(null);
    // 드래그 시에 저장했던 인덱스를 sourceIndex에 할당한다. 타입은 text
    const sourceIndex = Number(e.dataTransfer.getData("text"));

    // 원본 배열을 건드리지 않기 위해 copiedPost라는 배열 만들기
    const copiedPost = [...post];

    // 드래그로 잡아놨던 요소를 배열에서 제거하면서 movedPost에 저장
    const movedPost = copiedPost.splice(sourceIndex, 1)[0];

    // movedPost를 드래그 놓은 지점(targetIndex)에 삽입.
    copiedPost.splice(targetIndex, 0, movedPost);

    // 배열 업데이트
    setPost(copiedPost);

    // 서버에 수정 요청
    // const res = await axios.put(
    //   `http://15.164.216.204:4000/list/${movedPost.id}/move`,
    //   {
    //     targetIndex: targetIndex,
    //   }
    // );
  };

  const checkHandler = async (e, idx, id) => {
    // const todosRef = collection(firestore, "userlist", userId, "todos");

    // console.log(userId);
    if (e.target.checked) {
      // 카운트 증가

      await setCount((prev) => +prev + 1);
      // css 변경 위한 state
      setCheckedList([...checkedList, id]);

      // 체크했을 때 제일 아래로 내리는 기능
      let copiedPost = [...post];
      const finishedPost = copiedPost.splice(idx, 1)[0];
      setTimeout(() => {
        setPost(copiedPost);
        setPost((prev) => [...prev, finishedPost]);
      }, 400);

      // 새로고침해도 체크된 것들 기억하도록
      // localStorage.setItem("posts", JSON.stringify(post));

      // 곰 웃기
      setBearSmile(true);

      setTimeout(() => {
        setBearSmile(false);
      }, 2000);
    } else {
      setCount((prev) => +prev - 1);
      setCheckedList(checkedList.filter((el) => el !== id));
      setBearSmile(false);
      // 체크했을 때 제일 위로 올리는 기능
      let copiedPost = [...post];
      const uncheckedPost = copiedPost.splice(idx, 1)[0];

      setTimeout(() => {
        setPost(copiedPost);
        setPost((prev) => [uncheckedPost, ...prev]);
      }, 400);
    }
  };

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(post));
  }, [post]);

  return post.map((el, idx) => {
    const id = el.id;
    return (
      <StyledList
        key={id}
        draggable
        onDragStart={(e) => handleDragStart(e, idx)}
        onDragOver={(e) => handleDragOver(e, idx)}
        onDrop={(e) => handleDrop(e, idx)}
        // 드래그 하고있는 요소와 놓으려는 위치 요소 클래스 수정
        className={`
        ${checkedList.includes(id) ? "checked" : ""} 
        ${idx === draggingIndex ? "dragging" : ""}
        ${idx === dragOverIndex ? "dragover" : ""}
        `}
      >
        <input
          className="checkbox"
          type="checkbox"
          onChange={(e) => checkHandler(e, idx, id)}
          checked={checkedList.includes(id)}
        ></input>
        {/* <div className="list__pic--wrapper">
          <img
            className="list__pic--content"
            src={el.picUrl}
            alt={`puppy`}
          ></img>
        </div> */}
        <div className="list__content">
          {String(el.id) !== String(isEditing) ? (
            <div className="list__title">{el.title}</div>
          ) : (
            <section className="edit__container">
              <EditArea
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="edit__buttons">
                <OkButton
                  post={post}
                  setPost={setPost}
                  id={id}
                  setIsEditing={setIsEditing}
                  editedTitle={editedTitle}
                  userId={userId}
                />
                <CancelButton setIsEditing={setIsEditing} />
              </div>
            </section>
          )}
        </div>

        {!isEditing ? (
          <div className="edit-delete-container">
            {" "}
            <EditIcon
              className="butbut"
              post={post}
              id={id}
              setIsEditing={setIsEditing}
              setEditedTitle={setEditedTitle}
            />
            <DeleteIcon
              className="butbut"
              post={post}
              userId={userId}
              setPost={setPost}
              todosRef={todosRef}
              id={id}
            />
            {/* <button onClick={() => handleDelete(id)}>
              <DeleteButton
                icon={faTrashCan}
                className="butbut"
                // 여기서 id를 내려주는데 왜 버튼 눌렀을 때 id를 찍어보면 모든 요소의 id가 나올까?
                id={id}
              ></DeleteButton>
            </button> */}
          </div>
        ) : null}
      </StyledList>
    );
  });
};

const EditIcon = ({ post, id, setIsEditing, setEditedTitle }) => {
  const handleClick = () => {
    const listIndex = post.findIndex((el) => String(el.id) === String(id));
    setIsEditing(id);
    setEditedTitle(post[listIndex].title);
  };

  return (
    <FontAwesomeIcon
      className="fa-pencil"
      icon={faPencil}
      onClick={handleClick}
    />
  );
};

const DeleteIcon = ({ userId, setPost, id }) => {
  const handleDelete = async () => {
    // firestore에 새로운 doc을 추가하면 그 항목의 id가 자동 생성되고,
    // 삭제나 수정을 하려면 그 id를 사용해야만 한다.
    setPost((prevPost) => prevPost.filter((item) => item.id !== id));
    const todoRef = doc(firestore, "userlist", userId, "todos", id);
    await deleteDoc(todoRef);
  };

  return (
    <FontAwesomeIcon
      className="fa-trash-can"
      icon={faTrashCan}
      onClick={handleDelete}
    />
  );
};

const EditArea = ({ value, onChange }) => {
  return <input className="edit-area" value={value} onChange={onChange} />;
};

const OkButton = ({ userId, post, setPost, id, editedTitle, setIsEditing }) => {
  const handleEdit = async () => {
    // const res = await axios.put(`http://15.164.216.204:4000/list/${id}`, {
    //   title: editedTitle,
    // });
    // setPost(res.data);
    // setIsEditing("");

    const updatedPost = post.map((el) =>
      // 객체 변화 줄 때 방식 외워라 그냥 모르겠으면 이 놈아
      String(el.id) === String(id) ? { ...el, title: editedTitle } : el
    );
    setPost(updatedPost);
    setIsEditing("");

    const todoRef = doc(firestore, "userlist", userId, "todos", id);
    await updateDoc(todoRef, { title: editedTitle });
  };

  return (
    <button className="lil-button" onClick={handleEdit}>
      Edit
    </button>
  );
};

const CancelButton = ({ setIsEditing }) => {
  const handleCancel = () => {
    setIsEditing("");
  };
  return (
    <button className="lil-button" onClick={handleCancel}>
      Cancel
    </button>
  );
};
