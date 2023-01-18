import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Axios from "axios"
// Axios.defaults.baseURL = "http://127.0.0.1:8080"

//import context
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//My views and components
import LoginPage from "./views/LoginPage"
import AdminDashboardPage from "./views/AdminDashboardPage"
import UserDashboardPage from "./views/UserDashboardPage"
import Profile from "./components/Profile"
import ManageUsers from "./components/ManageUsers"
import ManageGroups from "./components/ManageGroups"
import ManageApplications from "./components/ManageApplications"
import ManageTasksPlans from "./components/ManageTasksPlans"
import Logout from "./components/Logout"

function Main() {

  const appInitialState = {
    isLoggedIn: false, 
    isAdmin: false
  }

  function appReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.isLoggedIn = true
        break
      case "logout":
        draft.isLoggedIn = false
        break
      case "isAdmin":
        draft.isAdmin = true
        break
      case "isNotAdmin":
        draft.isAdmin = false
        break
      default:
        break
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, appInitialState)
  
  var page = localStorage.getItem("page")

  useEffect(() => {
    async function loadStates() {
      try {
        let res = await Axios.get(
          "http://127.0.0.1:8080/api/views/checkAdmin",
          {
            withCredentials: true
          }
        )
        if (res.data.isAdmin) {
          dispatch({type: "isAdmin"})
        } else {
          dispatch({type: "isNotAdmin"})
        }
        dispatch({type: "login"})
      } catch (error) {
        dispatch({type: "logout"})
      }
    }
    loadStates()
  }, [])

  const getAdminPath = () => {
    if (typeof page === "undefined") {
      return <Navigate to="/admin" />
    } else {
      switch (page) {
        case "manageusers":
          return <Navigate to="/admin/users" />
        case "managegroups":
          return <Navigate to="/admin/groups" />
        case "profile":
          return <Navigate to="/admin/profile" />
        default:
          return <Navigate to="/admin" />
      }
    }
  }

  const getUserPath = () => {
    if (typeof page === "undefined") {
      return <Navigate to="/user" />
    } else {
      switch (page) {
        case "profile":
          return <Navigate to="/user/profile" />
        case "manageapplications":
          return <Navigate to="user/applications"/>
        case "managetasks":
          return <Navigate to="user/tasks"/>
        default:
          return <Navigate to="/user" />
      }
    }
  }

  return (
    
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={!state.isLoggedIn ? (<LoginPage />) : state.isAdmin ? (getAdminPath()) : (getUserPath())}/>
            <Route path="/admin" element={!state.isLoggedIn || !state.isAdmin ? (<Navigate to="/" />) : (<AdminDashboardPage />)} >
              <Route path="profile" element={<Profile />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="groups" element={<ManageGroups />} />
              <Route path="logout" element={<Logout />}/>
            </Route>
            <Route path="/user" element={!state.isLoggedIn || state.isAdmin ? (<Navigate to="/" /> ) : (<UserDashboardPage /> ) } >
              <Route path="profile" element={<Profile />} />
              <Route path="applications" element={< ManageApplications/>} />
              <Route path="tasks" element={< ManageTasksPlans/>} />
              <Route path="logout" element={<Logout />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
} //Hot Module Replacement (or HMR) is one of the most useful features offered by webpack. It allows all kinds of modules to be updated at runtime without the need for a full refresh
