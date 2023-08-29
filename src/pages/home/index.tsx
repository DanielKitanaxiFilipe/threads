import { CardPost } from "../../components/cardPost";
import Menu from "../../components/menu";
import "./style.scss";
import { HiLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import Rodape from "../../components/rodape";
import { CardUser } from "../../components/cardUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseConfig from "../../firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

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
  email: any;
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
  const [postText, setPostText] = useState("");
  const [postPhoto, setPostPhoto] = useState<File | null>(null);
  const storage = getStorage(app);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

              toast(`🦄📷 Image loading in progress...`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: progress,
                theme: "dark",
              });
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

                toast("Publication successfully posted! 🌟🦄", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
                setTimeout(() => {
                  window.location.reload(), 5000;
                });
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
          toast("Publication successfully posted! 🌟🦄", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } else {
        toast("Publication successfully posted! 🌟🦄", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
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
    const unsubscribe = onSnapshot(postCollection, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Post[];

      postData.sort((a, b) => b.createdAt - a.createdAt);

      setPosts(postData);
    });
    listUsers();
    return () => {
      unsubscribe(); // Importante: Desinscrever o listener ao desmontar o componente
    };
  }, []);

  return (
    <>
      <main>
        <section className="d-flex ">
          <Menu />
          <div className="w-100 h-100 pt-4 pb-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5">
                  {userData === null ? (
                    <div className="alert alert-dark pt-4 pb-4 mb-5">
                      You need to be logged in to make posts. 😉
                      <Link className="link" to="/login">
                        login
                      </Link>
                    </div>
                  ) : (
                    <>
                      {userData && ( // Check if userData is available
                        <div className="card-form-post ">
                          <div className="d-flex">
                            <div className="me-3">
                              <div className="avatar">
                                <img
                                  src={userData.photoURL || defaultProfileImage}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="w-100">
                              {(userData.displayName ?? "No Name").length > 20
                                ? `${(
                                    userData.displayName ?? "No Name"
                                  ).substring(0, 20)}...`
                                : userData.displayName ?? "No Name"}
                              <div className="input-group">
                                <textarea
                                  name=""
                                  id=""
                                  className="form-control"
                                  placeholder="Start athread..."
                                  value={postText}
                                  onChange={(e) => setPostText(e.target.value)}
                                />
                                <span>
                                  <button onClick={handlePostSubmit}>
                                    Post
                                  </button>
                                </span>
                              </div>
                              <div className=" card-form-post-botton d-flex justify-content-between">
                                <div>
                                  <label className="custom-file-upload">
                                    <input
                                      type="file"
                                      name="postPhoto"
                                      onChange={(e) => {
                                        setPostPhoto(
                                          e.target.files?.[0] || null
                                        );
                                        handleImagePreview(e);
                                      }}
                                    />
                                    <HiLink />
                                  </label>
                                </div>
                                <span className="text-alert">
                                  Anyone con reply
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            {previewImage && (
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="rounded"
                                style={{ width: "300px" }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {posts.map((post) => (
                      <div key={post.id}>
                        <CardPost
                          nameUser={post.displayName}
                          photoUser={post.photoURL}
                          text={post.text}
                          img={post.photo}
                        />
                      </div>
                    ))}

                  {posts.length === 0 ? (
                    <div className="alert alert-dark pt-4 pb-4 mb-5">
                      📤 No posts currently.
                    </div>
                  ) : null}
                </div>
                <div className="col-lg-3 ms-5">
                  <div className="top-sty">
                    {userData && ( // Check if userData is available
                      <CardUser
                        img={userData.photoURL || defaultProfileImage}
                        name={
                          (userData.displayName ?? "No Name").length > 20
                            ? `${(userData.displayName ?? "No Name").substring(
                                0,
                                20
                              )}...`
                            : userData.displayName ?? "No Name"
                        }
                        email={
                          (userData.email ?? "No Name").length > 20
                            ? `${(userData.email ?? "No Name").substring(
                                0,
                                20
                              )}...`
                            : userData.email ?? "No Name"
                        }
                        link={
                          <>
                            <Link to="" className="a-link">
                              Swich
                            </Link>
                          </>
                        }
                      />
                    )}

                    <div className="mt-4 div-users">
                      <div className="d-flex mb-3 justify-content-between">
                        <h6 className="h6">Suggested for you</h6>
                        <Link to="" className="a-link">
                          See All
                        </Link>
                      </div>

                      {users.slice(0, 8).map((user) => (
                        <div key={user.id}>
                          <CardUser
                            img={user?.photoURL || ""}
                            name={
                              user.displayName.length > 20
                                ? `${user.displayName.substring(0, 20)}...`
                                : user.displayName
                            }
                            email={
                              user.email.length > 20
                                ? `${user.email.substring(0, 20)}...`
                                : user.email
                            }
                            link={
                              <>
                                <Link to="" className="btn btn-outline-light">
                                  Follow
                                </Link>
                              </>
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <ToastContainer />
                    <Rodape />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
export default Home;
