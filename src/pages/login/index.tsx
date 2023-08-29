import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import firebaseConfig from "../../firebase";
import logo from './../../assets/threads-logo.svg'
import './style.scss'
import { Link } from "react-router-dom";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [user, loading, error] = useAuthState(auth);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = userCredential.user;
      const userData = { displayName, email, photoURL };
      const userCollection = collection(db, "users");
      const querySnapshot = await getDocs(userCollection);
      const userExists = querySnapshot.docs.some(
        (doc) => doc.data().email === email
      );
      if (!userExists) {
        await addDoc(userCollection, userData);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  if (user) {
    window.location.replace('/');
  }
  

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Erro ao fazer login: {error.message}</>;
  }

  return (
    <div className="w-100 h-100 d-flex align-items-center">
      <div className="container pt-5 pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-2">
            <div className="text-center mb-5 mt-5">
              <img src={logo} width={70} alt="" />
            </div>
            <button className="form-control btn-goole" onClick={handleSignInWithGoogle}>
            Login with Google
            </button>
            <div className="mt-5 text-center">
              <Link className="a-links" to='/'>Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
