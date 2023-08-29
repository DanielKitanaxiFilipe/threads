import React from "react";
import "./style.scss";
import { 
  HiHeart, 
  HiOutlineChat, 
  HiOutlineDotsHorizontal, 
  HiOutlinePaperAirplane 
} from "react-icons/hi";

interface card {
  nameUser: string
  photoUser: string
  text:string
  img: any
}
export const CardPost: React.FC<card> = (props) => {
  return (
    <>
      <div className="cardPost mt-4">
        <div className="card-top">
          <div className="avatar">
            <img src={props.photoUser} alt="" />
          </div>
        </div>
        <div className="card-post">
          <div className="d-flex justify-content-between">
            <span>{props.nameUser}</span>
            <div>
              <HiOutlineDotsHorizontal />
            </div>
          </div>
          <div className="mt-1">
            {props.text}
            <img 
            src={props.img} 
            alt="" 
            className="img-fluid rounded mt-1" 
            title=""
            />
          </div>
          <div className="menus-bottons mt-1">
            <button><HiHeart/></button>
            <button><HiOutlineChat/></button>
            <button><HiOutlinePaperAirplane/></button>
          </div>
        </div>
        <div className="card-botton d-flex">
            <div className="avatares">
                <div className="d-flex">
                <div className="avatar-b">
                    <img src='https://i.pinimg.com/564x/fd/cf/69/fdcf6913ae8592d96a3d72a9f0cb9aac.jpg' alt="" />
                </div>
                <div className="avatar-a">
                    <img src='https://i.pinimg.com/564x/45/a2/08/45a208aabbfbd851bb544004ac1f22bf.jpg' alt="" />
                </div>
                </div>
                <div className="avatar-c">
                    <img src='https://i.pinimg.com/564x/5d/27/2f/5d272f202a5eac394bdee82d3e8ccff7.jpg' alt="" />
                </div>
            </div>
            <span>
                600 repllis . 12K likes
            </span>
        </div>
      </div>
    </>
  );
};
