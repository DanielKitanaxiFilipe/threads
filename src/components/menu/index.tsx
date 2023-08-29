import "./style.scss";
import logo from "./../../assets/threads-logo.svg";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebase";
import Dropdown from "react-bootstrap/Dropdown";
import { useDeleteUser } from "react-firebase-hooks/auth";
import {
  HiHeart,
  HiHome,
  HiOutlineMenu,
  HiOutlinePlusCircle,
  HiSearch,
} from "react-icons/hi";
const defaultProfileImage = "";
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default function Menu() {
  const logout = () => {
    signOut(auth);
  };
  const [deleteUser, loading, error] = useDeleteUser(auth);

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
  const [userData] = useAuthState(auth);
  const menu = [
    {
      name: "Home",
      link: "",
      icon: <HiHome />,
    },
    {
      name: "Search",
      link: "",
      icon: <HiSearch />,
    },
    {
      name: "Create",
      link: "",
      icon: <HiOutlinePlusCircle />,
    },
    {
      name: "Activity",
      link: "",
      icon: <HiHeart />,
    },
  ];
  return (
    <>
      <div className="menu">
        <div className="container">
          <div className="logo pt-4 pb-3">
            <img src={logo} alt="" />
          </div>
          <div className="menus">
            <ul className="nav">
              {menu.map((menus) => (
                <li className="mb-3">
                  <Link to={menus.link} className="link-menu">
                    <span>{menus.icon}</span>
                    {menus.name}
                  </Link>
                </li>
              ))}
              {userData && ( // Check if userData is available
                <li className="mb-3">
                  <Link to="/" className="link-menu">
                    <span>
                      <span className="avatar">
                        <img
                          src={userData.photoURL || defaultProfileImage}
                          alt=""
                        />
                      </span>
                    </span>
                    Profil
                  </Link>
                </li>
              )}

              <li className="menu-botton">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="link-menu"
                  >
                    <span>
                      <HiOutlineMenu />
                    </span>
                    More
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-lg">
                    <Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        const success = await deleteUser();
                        if (success) {
                          alert("You have been deleted");
                        }
                      }}
                    >
                      Delete current user
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <Link to="/" className="link-menu">
                  <span>
                    <HiOutlineMenu />
                  </span>
                  More
                </Link> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
