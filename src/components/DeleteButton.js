import axios from "axios";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const DeleteButton = ({ index, post, setPost }) => {

  const handleClick = async () => {
    const deleteDiscussion = async () => {
      console.log(index)
      const response = await axios.delete(`http://localhost:4000/list/${index}`);
      console.log(response.data);
    };
    await deleteDiscussion();

    const getPost = async () => {
      const response = await axios.get('http://localhost:4000/list');
      const copy = response.data;
      console.log(copy);
      setPost(copy);
    };
    getPost();
  };
  
  return (
    <FontAwesomeIcon className="fa-trash-can" icon={faTrashCan} onClick={handleClick}></FontAwesomeIcon>
  ); 
}