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

import {
  getFirestore,
  collection,
  addDoc,
  Query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function AppPage() {
  const [post, setPost] = useState([]);

  const [bearSmile, setBearSmile] = useState(false);
  const [count, setCount] = useState(0);

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
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
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
            // 변경한 state를 바로 밑에서 사용하면 안 먹히지
            getDocs(ref).then((querySnapshot) => {
              const todos = querySnapshot.docs.map((doc) => ({
                // 렌더링 때도 firestore id를 넣어줘야 함
                id: doc.id,
                title: doc.data().title,
              }));

              // 로컬스토리지 체크리스트 불러옴
              const storedCheckedList = localStorage.getItem("checkedList");
              const checked = JSON.parse(storedCheckedList);
              // 빈 배열 만들어서 체크된 애들 push
              const checkedArr = [];
              todos.forEach((el, idx) => {
                if (checked.includes(el.id)) {
                  checkedArr.push(el);
                }
              });
              // todosArr에서 체크 된 애들 다 빼버리고
              // 체크된 애들만 모아놓은 배열과 합침
              // => 체크된 애들이 뒤로감
              const todosArr = todos
                .filter((el) => !checked.includes(el.id))
                .concat(checkedArr);
              // 이전의 데이터를 모두 지우고 새로운 데이터를 설정합니다.
              setPost(todosArr);
            });
          }
        });
      }
    });
    // 의존성 배열에서 post를 제거하니까 key값에 firestore id가 들어감
  }, []);

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
      />
    </StyledScreen>
  );
}

export default AppPage;
