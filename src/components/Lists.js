import React from "react";
import { StyledLists } from "./styles/StyledLists";
import { List } from "./List";

const Lists = ({
  post,
  setPost,
  setBearSmile,
  setCount,
  firestore,
  todos,
  todosRef,
  userId,
  checkedList,
  setCheckedList,
}) => {
  return (
    <StyledLists>
      <List
        todos={todos}
        todosRef={todosRef}
        userId={userId}
        firestore={firestore}
        post={post}
        setPost={setPost}
        setBearSmile={setBearSmile}
        setCount={setCount}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
      ></List>
    </StyledLists>
  );
};

export default Lists;
