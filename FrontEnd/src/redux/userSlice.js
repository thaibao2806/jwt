import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUser: null,
            isFetching: false,
            error: false
        },
        msg: ""
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isFetching = true
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false
            state.users.allUser = action.payload
        },
        getUserFail: (state) => {
            state.users.isFetching = false
            state.users.error = true
        },
        deleteUserStart: (state) => {
            state.users.isFetching = true
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false
            state.msg = action.payload
        },
        deleteUserFailed: (state, action) => {
            state.users.isFetching = false
            state.users.error = true
            state.msg = action.payload
        }
    }
})

export const {
    getUserFail,
    getUserStart,
    getUserSuccess,
    deleteUserFailed,
    deleteUserSuccess,
    deleteUserStart
} = userSlice.actions

export default userSlice.reducer