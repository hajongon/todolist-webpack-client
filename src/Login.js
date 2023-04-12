import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import googleButton from "./assets/btn_google_signin_light_normal_web@2x.png";
import "./index.css";
import "./login.css";
import Header from "./components/Header";
import bearImg from "../public/bearcrop.png";

const Login = () => {
  const navigate = useNavigate();
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDHMKHch2nFclkOZ9nUxSaaL8UwhKdGN1s",
    authDomain: "hajongon-todo.firebaseapp.com",
    projectId: "hajongon-todo",
    storageBucket: "hajongon-todo.appspot.com",
    messagingSenderId: "386379489004",
    appId: "1:386379489004:web:50c0ce0ead7ff15af38fc9",
    measurementId: "G-FEVT2YDTBJ",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        navigate("/app");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  return (
    <div className="login-page">
      <Header />
      <img className="bear" src={bearImg} alt="bear" />
      <img
        src={googleButton}
        onClick={handleSignInWithGoogle}
        className="google-login"
      />
    </div>
  );
};

export default Login;
