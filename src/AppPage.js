import "./App.css";

import Header from "./components/Header";
import Submit from "./components/Submit";
import Lists from "./components/Lists";
import bearImg from "../public/bearcrop.png";
import bearSmileImg from "../public/bearsmilecrop.png";
import { StyledScreen } from "./StyledScreen";

import firestore from "./firebase";

import axios from "axios";

import { useState, useEffect } from "react";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function AppPage() {
  // useState를 애초에 로컬스토리지로 초기화
  const [post, setPost] = useState(
    () => JSON.parse(window.localStorage.getItem("posts")) || []
  );
  const [bearSmile, setBearSmile] = useState(false);
  const [count, setCount] = useState(
    () => JSON.parse(window.localStorage.getItem("count")) || 0
  );

  // firestore

  // useEffect(() => {
  //   const getPost = async () => {
  //     // 왜 process.env.API_URL을 모를까
  //     // cross-env 어케 설정하는 건지 모르겠음
  //     // REACT_APP_ 실패
  //     // env-cmd -f .env.development webpack serve 실패
  //     // dotenv.config() 실패
  //     // new webpack.DefinePlugin 실패.. 다시 돌아온다..

  //     const response = await axios.get(`http://15.164.216.204:4000/list`);
  //     const copy = response.data;
  //     setPost(copy);
  //   };
  //   getPost();
  // }, []);

  const [userId, setUserId] = useState(null);
  const [todosRef, setTodosRef] = useState(null);
  const [checkedList, setCheckedList] = useState(
    () => JSON.parse(window.localStorage.getItem("checkedList")) || []
  );

  useEffect(() => {
    const storedCount = localStorage.getItem("count");
    setCount(Number(storedCount));
  }, []);

  useEffect(() => {
    // count 불러오기
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      // console.log(post);
      if (user) {
        const id = user.uid;

        setUserId(id);
        // userlist라는 콜렉션을 참조
        const userDocRef = doc(firestore, "userlist", id);

        getDoc(userDocRef).then((docSnapshot) => {
          // 내 아이디로 된 doc이 없으면
          if (!docSnapshot.exists()) {
            // todos라는 이름의 빈 배열 생성(todos가 서브콜렉션인가)
            setDoc(userDocRef, { todos: [] });
            // 이미 있으면
          } else {
            const ref = collection(userDocRef, "todos");
            setTodosRef(ref);
            // 변경한 state를 바로 밑에서 사용하면 안 먹힘
            getDocs(ref).then((querySnapshot) => {
              const todos = querySnapshot.docs.map((doc) => ({
                // 렌더링 때도 firestore id를 넣어줘야 함
                id: doc.id,
                title: doc.data().title,
              }));

              // 로컬스토리지 체크리스트 불러옴
              // const storedCheckedList = localStorage.getItem("checkedList");
              // if (storedCheckedList) {
              //   const checked = JSON.parse(storedCheckedList);
              //   // 빈 배열 만들어서 체크된 애들 push
              //   const checkedArr = [];
              //   todos.forEach((el) => {
              //     if (checked.includes(el.id)) {
              //       checkedArr.push(el);
              //     }
              //   });
              //   // todosArr에서 체크 된 애들 다 빼버리고
              //   // 체크된 애들만 모아놓은 배열과 합침
              //   // => 체크된 애들이 뒤로감
              //   const todosArr = todos
              //     .filter((el) => !checked.includes(el.id))
              //     .concat(checkedArr);

              //   setPost(todosArr);
              // }

              // 로컬스토리지에 이미 posts가 있으면 그거 그대로 쓰고

              if (!post.length) {
                setPost(todos);
              }
            });
          }
        });
      }
    });
    // 의존성 배열에서 post를 제거하니까 key값에 firestore id가 들어감
  }, []);

  useEffect(() => {
    // checkedList 값이 변경될 때마다 로컬 스토리지에 저장
    // 새로고침하면 왜인진 몰라도 checkedList가 빈 배열이 되는 듯. 빈 배열일 경우 로컬스토리지를 업데이트하지 않도록 한다.
    if (checkedList.length > 0) {
      localStorage.setItem("checkedList", JSON.stringify(checkedList));
    }
    localStorage.setItem("count", count);
  }, [checkedList]);

  const resetHandler = () => {
    setCount(0);
  };

  return (
    <StyledScreen>
      <Header />
      {!bearSmile ? (
        <img className="bear" src={bearImg} alt="bear" />
      ) : (
        <img className="bearsmile" src={bearSmileImg} alt="bear smille" />
      )}

      <div className="count-container">
        <div className="count">{`count : ${count}`}</div>
        <button className="reset-button" onClick={resetHandler}>
          reset
        </button>
      </div>

      <Submit firestore={firestore} post={post} setPost={setPost} />

      <Lists
        firestore={firestore}
        userId={userId}
        todosRef={todosRef}
        post={post}
        setPost={setPost}
        setBearSmile={setBearSmile}
        setCount={setCount}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
        count={count}
      />
    </StyledScreen>
  );
}

export default AppPage;
