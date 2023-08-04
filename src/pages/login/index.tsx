import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = userCredential.user;
      const userData = { displayName, email, photoURL };
      const userCollection = collection(db, 'users');
      const querySnapshot = await getDocs(userCollection);
      const userExists = querySnapshot.docs.some((doc) => doc.data().email === email);
      if (!userExists) {
        await addDoc(userCollection, userData);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (user) {
    return <>Logado</>;
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Erro ao fazer login: {error.message}</>;
  }

  return (
    <div>
      <button className="form-control" onClick={handleSignInWithGoogle}>
        Login com Google
      </button>
    </div>
  );
};

export default Login;
