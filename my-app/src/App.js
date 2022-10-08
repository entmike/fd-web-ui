import { useAuth0 } from "@auth0/auth0-react"
import { ChakraProvider } from "@chakra-ui/react"
import { useState, useEffect } from "react"

import "./App.css"

import { FdFooter } from "./components/shared/FdFooter.js"

import { BackToTop } from "./components/shared/BackToTop"
import { SiteRouter } from "./components/shared/SiteRouter"


function App() {
  const {user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const [permissions, setPermissions] = useState(null)
  const [pollId, setPollId] = useState(null)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [myInfo, setMyInfo] = useState({})

  const getToken = async () => {
    try {
      if(user!==undefined){
        let t = await getAccessTokenSilently({
          audience: "https://api.feverdreams.app/",
        })
        setToken(t)
        let userId = user.sub.split("|")[2]
        setUserId(userId)
        let headers
        if (t) {
          const apiURL = `${process.env.REACT_APP_api_url}/mypermissions`;
          headers = {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${t}`
          }
          fetch(apiURL,{headers})
          .then((response) => {
            return response.json()
          }).then(permissions=>{
            setPermissions(permissions)
          })
        }
      }
    } catch (e) {
      if (e.error === 'login_required') {
        loginWithRedirect();
      }
      if (e.error === 'consent_required') {
        loginWithRedirect();
      }
      throw e;
    }
  }

  useEffect(() => {
    getToken()
    return ()=>{
      window.clearTimeout(pollId)
      setPollId(null)
    }
  },[user])

  useEffect(()=>{
    function checkMyInfo() {
      const infoURL = `${process.env.REACT_APP_api_url}/v3/myinfo`;
      if (token){
        let headers = {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
        fetch(infoURL,{headers})
          .then((response) => {
            return response.json()
          }).then(info=>{
            setMyInfo(info)
            setPollId(window.setTimeout(checkMyInfo, 5000))
          }).catch(err=>{
            setMyInfo({})
            setPollId(window.setTimeout(checkMyInfo, 5000))
          })
        }
    }
    if (token) setPollId(window.setTimeout(checkMyInfo, 500))
    return ()=>{
      window.clearTimeout(pollId)
      setPollId(null)
    }
  },[token])

  return (
    <ChakraProvider>
      {/* <InstantSearch searchClient={searchClient} indexName="feverdreams"> */}
          <div className="App">
            <BackToTop />
            <SiteRouter token={token} isAuthenticated={isAuthenticated} userId={userId} myInfo={myInfo}/>
            <FdFooter />
          </div>
      {/* </InstantSearch> */}
    </ChakraProvider>
  )
}

export default App
