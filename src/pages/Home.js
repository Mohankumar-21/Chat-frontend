import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {logout, setOnlineUser, setUser, setsocketConnection} from '../redux/userSlice';
import '../CSS/Home.css';
import Sidebar from '../component/Sidebar';
import logo from '../assests/logo4.png';
import io  from 'socket.io-client';


const Home = () => {
   // eslint-disable-next-line
  const user = useSelector(state =>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async() =>
  {
     try
     {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
       const response = await axios(
        {
           method : 'get',
           url : URL,
           withCredentials : true
        }
       );
      
       dispatch(setUser(response.data.data))

       if(response.data.data.logout)
        {
          dispatch(logout());
          navigate('/email');
        }

     }
     catch(error)
     {
        message.error("Fetching user data failed!!")
     }
  }

  useEffect(()=>
  {
    fetchUserDetails();
    // eslint-disable-next-line
  },[])
 
 

  useEffect(()=>
  {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,
      {
        auth : {
          token : localStorage.getItem('token')
        }
      }
    );

    console.log(socketConnection)

    socketConnection.on('onlineusers',(data)=>
    {
      dispatch(setOnlineUser(data));
    })
    
    dispatch(setsocketConnection(socketConnection))

    return ()=>
      {
        socketConnection.disconnect();
      }
   
    // eslint-disable-next-line
  },[])
  
  const basePath = location.pathname === "/";

  return (
    <div className='Home-container' >
       <div className= {!basePath ? 'd-none d-md-block bg-white sidebar-container' : 'bg-white sidebar-container'}>
         <Sidebar />
       </div>
  
       <div className={basePath ? 'd-none' : ""}>
        <Outlet />
      </div>

      <div className={`d-none ${basePath ? "d-lg-flex justify-content-center align-items-center flex-column gap-2" : ""}`}>
        <div>
          <img 
           src={logo }
           width={300}
           alt='logo'
          />
        </div>
        <p>Select User to send message</p>
       </div>
       
    </div>
  )
}

export default Home;
