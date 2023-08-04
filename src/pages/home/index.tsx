import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseConfig from "../../firebase";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDeleteUser } from "react-firebase-hooks/auth";
import './style.scss'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseConfigDB = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const defaultProfileImage = "";
export const auth = getAuth(app);
const logout = () => {
  signOut(auth);
};
interface Post {
  id: string;
  text: string;
  photo: string;
  photoURL: string;
  displayName: string;
  email: string;
  createdAt: any;
}

interface User {
  id: string;
  displayName: string;
  photoURL: string;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const db = getFirestore(firebaseConfigDB);
  const postCollection = collection(db, "post");
  const userCollection = collection(db, "users");
  const [userData] = useAuthState(auth);
  const [deleteUser, loading, error] = useDeleteUser(auth);
  const [postText, setPostText] = useState("");
  const [postPhoto, setPostPhoto] = useState<File | null>(null);
  const storage = getStorage(app);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Estado para armazenar o URL da imagem selecionada

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  const handlePostSubmit = async () => {
    try {
      if (postText || postPhoto) {
        if (postPhoto) {
          const storageRef = ref(storage, `images/${postPhoto.name}`);
          const uploadTask = uploadBytesResumable(storageRef, postPhoto);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload progress: ${progress}%`);
            },
            (error) => {
              console.error("Error uploading image:", error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(storageRef);
                const newPost: Post = {
                  id: Math.random().toString(36).substr(2, 9),
                  text: postText,
                  photo: downloadURL,
                  photoURL: userData?.photoURL || "",
                  displayName: userData?.displayName || "",
                  email: userData?.email || "",
                  createdAt: new Date(),
                };
                await addDoc(postCollection, newPost);
                setPosts([...posts, newPost]);
                setPostText("");
                setPostPhoto(null);
              } catch (error) {
                console.error("Error getting download URL:", error);
              }
            }
          );
        } else {
          const newPost: Post = {
            id: Math.random().toString(36).substr(2, 9),
            text: postText,
            photo: "",
            photoURL: userData?.photoURL || "",
            displayName: userData?.displayName || "",
            email: userData?.email || "",
            createdAt: new Date(),
          };
          await addDoc(postCollection, newPost);
          setPosts([...posts, newPost]);
          setPostText("");
        }
      } else {
        console.warn("You must enter either text or upload a photo.");
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostPhoto(file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const listUsers = async () => {
    try {
      const querySnapshot = await getDocs(userCollection);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(usersData);
    } catch (error) {
      console.error("Error listing users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const querySnapshot = await getDocs(postCollection);
        const postData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as Post[];

        postData.sort((a, b) => b.createdAt - a.createdAt);

        setPosts(postData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
    listUsers(); // Chama a função para listar os usuários
  }, []);

  return (
    <div>
      <button onClick={logout}>Log out</button>
      <button
        onClick={async () => {
          const success = await deleteUser();
          if (success) {
            alert("You have been deleted");
          }
        }}
      >
        Delete current user
      </button>

      {userData === null ? (
        <>faz o login</>
      ) : (
        <div className="upPost">
          <textarea
            name="postText"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
          <label className="custom-file-upload">
            <input
              type="file"
              name="postPhoto"
              onChange={(e) => {
                setPostPhoto(e.target.files?.[0] || null);
                handleImagePreview(e);
              }}
            />
            Escolher imagem
          </label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <button onClick={handlePostSubmit}>Postar</button>
        </div>
      )}

      {userData && ( // Check if userData is available
        <div className="div">
          <img
            src={userData.photoURL || defaultProfileImage}
            alt=""
            width={100}
          />
          <p>Name: {userData.displayName}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}

      <h1>Lista de Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <div>
              <div>
                <img src={post.photoURL} alt="" width={100} />
                {post.displayName}
              </div>
              <h2>{post.text}</h2>
              {post.photo && <img src={post.photo} alt="" width={100} />}
            </div>
          </li>
        ))}
      </ul>

      <h1>Lista de usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <div>
                <img src={user.photoURL} alt="" width={100} />
                {user.displayName}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
