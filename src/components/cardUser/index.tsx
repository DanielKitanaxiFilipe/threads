import React from "react";
import "./style.scss";
interface cardUser {
  img: any;
  name: any;
  email: any;
  link: any;
}
export const CardUser: React.FC<cardUser> = (props) => {
  return (
    <>
      <div className="user mb-3 d-flex justify-content-between">
        <div className=" d-flex">
          <div className="avatar">
            <img src={props.img} alt="" />
          </div>
          <div className="ms-3 me-3">
            <h6>{props.name}</h6>
            <span>{props.email}</span>
          </div>
        </div>
        <div>
            {props.link}
        </div>
      </div>
    </>
  );
};
