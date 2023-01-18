import React, { useEffect, useContext } from "react"
import { message } from "antd"
import Axios from "axios"
//import Cookies from "universal-cookie"

//Import context
import DispatchContext from "../DispatchContext"

const Logout = () => {
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    async function logout() {
      try {
        let res = await Axios.get("http://127.0.0.1:8080/api/auth/logout", {
          withCredentials: true
        })
        console.log(res)

        //set isLoggedIn to false to redirect to login page
        appDispatch({type: "logout"})
        localStorage.clear()
        
        // cookies.remove("accessToken", { path: '/' });
        let successMessage = res.data.message
        message.success(successMessage)
      } catch (error) {
        console.log(error)
      }
    }
    logout()
  }, [])

  return <></>
}

export default Logout
