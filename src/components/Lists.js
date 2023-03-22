import React from "react";
import { StyledLists } from "./styles/StyledLists";
import { List } from "./List";

const Lists = ({ post, setPost, setBearSmile, setCount }) => {
  return (
    <StyledLists>
      <List
        post={post}
        setPost={setPost}
        setBearSmile={setBearSmile}
        setCount={setCount}
      ></List>
    </StyledLists>
  );
};

export default Lists;
