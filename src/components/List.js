import { StyledList } from "./styles/StyledList";
import { DeleteButton } from "./DeleteButton";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import "./List.css";

export const List = ({ post, setPost, setBearSmile, setCount }) => {
  const [isEditing, setIsEditing] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [checkedList, setCheckedList] = useState([]);
  

  const handleDragStart = (e, index) => {
    // 드래그 하면 드래그되는 요소의 인덱스를 데이터로 설정한다.
    // "text/plain"은 데이터 타입.
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log(e.target)
  };

  const handleDrop = async (e, targetIndex) => {

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
    const res = await axios.put(
      `http://localhost:4000/list/${movedPost.id}/move`,
      {
        targetIndex: targetIndex,
      }
    );
  };

  const checkHandler = async (e, idx, index) => {
    
    if(e.target.checked) {
      // 카운트 증가
      setCount((prev) => prev + 1)

      // 체크했을 때 제일 아래로 내리는 기능
      const copiedPost = [...post];
      const finishedPost = copiedPost.splice(idx, 1)[0];
      copiedPost.push(finishedPost);
      
      // 텀을 둬서 체크 후 내려가는 것 알 수 있게
      setTimeout(() => {
        setPost(copiedPost);
      }, 400);

      // 서버에 put 요청
      const res = await axios.put(
        `http://localhost:4000/list/${finishedPost.id}/check`,
      )

      // css 변경 위한 state
      setCheckedList([...checkedList, index]);

      // 곰 웃기
      setBearSmile(true);

      setTimeout(() => {
        setBearSmile(false);
      }, 2000);

    } else {
      setBearSmile(false);
      setCheckedList(checkedList.filter((el) => el !== index));
    }
    
  }

  return post.map((el, idx) => {
    const index = el.id;
    return (
      <StyledList
        key={el.id}
        draggable
        onDragStart={(e) => handleDragStart(e, idx)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, idx)}
        className={checkedList.includes(index) ? "checked" : ""}
        
      >
        <div className="list__pic--wrapper">
          <img
            className="list__pic--content"
            src={el.picUrl}
            alt={`puppy`}
          ></img>
        </div>
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
                  index={index}
                  setIsEditing={setIsEditing}
                  editedTitle={editedTitle}
                />
                <CancelButton setIsEditing={setIsEditing} />
              </div>
            </section>
          )}
        </div>

        {!isEditing ? (
          <>
            {" "}
            <EditIcon
              post={post}
              index={index}
              setIsEditing={setIsEditing}
              setEditedTitle={setEditedTitle}
            />
            <DeleteButton post={[post]} setPost={setPost} index={index} />
            <input className="checkbox" type="checkbox" onChange={(e)=>checkHandler(e, idx, index)}></input>
          </>
        ) : null}
      </StyledList>
    );
  });
};

const EditIcon = ({ post, index, setIsEditing, setEditedTitle }) => {
  const handleClick = () => {
    const listIndex = post.findIndex((el) => String(el.id) === String(index));
    setIsEditing(index);
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

const EditArea = ({ value, onChange }) => {
  return <input className="edit-area" value={value} onChange={onChange} />;
};

const OkButton = ({ setPost, index, editedTitle, setIsEditing }) => {
  const handleEdit = async () => {
    const res = await axios.put(`http://localhost:4000/list/${index}`, {
      title: editedTitle,
    });
    setPost(res.data);
    setIsEditing("");
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
