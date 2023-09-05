import { useEffect } from "react";
import "./home.css";
import { deleteUser, getAllUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const HomePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.login?.currentUser)
  const userList = useSelector((state) => state.users.users?.allUser)
  const message = useSelector((state) => state.users?.msg)
  let axiosJWT =  createAxios(user, dispatch, loginSuccess)
  const navigate = useNavigate()
  
  const handleDelete = (id) => {
    deleteUser(user?.acessToken, dispatch, id, axiosJWT);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.acessToken) {
      getAllUser(user?.acessToken, dispatch, axiosJWT);
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">Your role: {user?.admin ? "Admin" : "User"}</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.userName}</div>
              <div className="delete-user" onClick={()=>handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
      {message}
    </main>
  );
};

export default HomePage;
