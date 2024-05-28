import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   _id : "",
   name : "",
   email : "",
   profile_pic : "",
   token : "",
   onlineUser : [],
   socketConnection : null
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser : (state, action) => 
        {
            state._id = action.payload._id
            state.name = action.payload.name
            state.profile_pic = action.payload.profile_pic
            state.email = action.payload.email
        },
    setToken : (state, action) =>
        {
            state.token = action.payload
        },
    logout : (state,action) =>
        {
            state._id = ""
            state.name = ""
            state.profile_pic = ""
            state.email = ""
            state.token = ""
            state.socketConnection =""
        },
    setOnlineUser : (state,action)=>
        {
            state.onlineUser = action.payload
        },
    setsocketConnection : (state, action) =>
        {
            state.socketConnection = action.payload
        }
  },
})


export const {setUser,setToken, logout, setOnlineUser, setsocketConnection  } = userSlice.actions

export default userSlice.reducer