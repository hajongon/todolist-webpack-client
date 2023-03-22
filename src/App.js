import "./App.css";

import Header from "./components/Header";
import Submit from "./components/Submit";
import Lists from "./components/Lists";

import axios from "axios";

import bearImg from '../public/bear.png'
import bearSmileImg from '../public/bearsmile.png'

import { StyledScreen } from "./StyledScreen";
import { useState, useEffect } from "react";

function App() {
  const [post, setPost] = useState([]);
  const [bearSmile, setBearSmile] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getPost = async () => {
      const response = await axios.get("http://localhost:4000/list");
      const copy = response.data;
      setPost(copy);
    };
    getPost();
  }, []);

  return (
    <StyledScreen>
      <Header />
      {!bearSmile ? (
        <img className="bear" src={bearImg} alt="bear" />
      ) : (
        <img className="bearsmile" src={bearSmileImg} alt="bear smille" />
      )}
      <div className="count">{`count : ${count}`}</div>
      <Submit post={post} setPost={setPost} />
      
      <Lists post={post} setPost={setPost} setBearSmile={setBearSmile} setCount={setCount}/>
    </StyledScreen>
  );
}

export default App;
