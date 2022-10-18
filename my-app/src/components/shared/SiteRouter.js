import { Hero } from "../Pages/HomePage"
import UserGalleryPage from "../Pages/UserGalleryPage"
import DeletedGalleryPage from "../Pages/DeletedGalleryPage"
import RandomGalleryPage from "../Pages/RandomGalleryPage"
import RecentGalleryPage from "../Pages/RecentGalleryPage"
import PopularGalleryPage from "../Pages/PopularGalleryPage"
import RecentlyLikedGalleryPage from "../Pages/RecentlyLikedGalleryPage"
import MutatePage from "../Pages/MutatePage"
import MutateStablePage from "../Pages/MutateStablePage"
import MyInvitesPage from "../Pages/MyInvitesPage"
import IncubatePage from "../Pages/MutatePage"
import CreateDreamPage from "../Pages/CreateDreamPage"
import JobsPage from "../Pages/JobsPage"
import MyJobsPage from "../Pages/MyJobsPage"
import MyWorkspacePage from "../Pages/MyWorkspacePage"
import PiecePage from "../Pages/PiecePage"
import GpuStatusPage from "../Pages/GpuStatusPage"
import AgentJobsPage from "../Pages/AgentJobsPage"
import ColorPage from "../Pages/ColorPage"
import JobGenerator from "../Pages/JobGenerator"
import FollowingPage from "../Pages/FollowingPage"
import MyProfile from "../Pages/MyProfile"
import MyUploads from "../Pages/MyUploads"
import { Nav } from "./Nav"
import { Terms } from "./Terms"
import { Welcome } from "./Welcome"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import SearchPage from "../Pages/SearchPage"
// import algoliasearch from "algoliasearch/lite"

// import { InstantSearch } from "react-instantsearch-hooks-web"
import MyLikesPage from "../Pages/MyLikesPage"

// const searchClient = algoliasearch("SBW45H5QPH", "735cfe2686474a143a610f864474b2f2")

export const SiteRouter = (props)=>{
    const {token, isAuthenticated, userId, permissions, myInfo} = props
    function routes(){
        return <Routes key={"routes"}>
            {/* Gallery pages */}
            <Route path="/gallery/:user_id/:page" element={<UserGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route path="/deleted/:user_id/:page" element={<DeletedGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route path="/random/:type/:amount" element={<RandomGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route path="/recent/:page" element={<RecentGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route path="/popular/:type/:page" element={<PopularGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route path="/recentlyliked/:page" element={<RecentlyLikedGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId} permissions={permissions}/>} />
            <Route path="/recent/:type/:page" element={<RecentGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId} permissions={permissions}/>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/rgb/:r/:g/:b/:range/:amount/:page" element={<ColorPage />} />

            {/* Non-gallery pages */}
            <Route path="/" element={<Hero token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
            <Route
                path={'/piece/:uuid'}
                element={<PiecePage token={token} isAuthenticated={isAuthenticated} user={userId}/>}
            />
            <Route path="/jobs" element={<JobsPage/>}></Route>
            <Route path="/jobs/:type" element={<JobsPage />}></Route>
            <Route path="/myjobs/:status/:page" element={<MyJobsPage token={token} isAuthenticated={isAuthenticated}/>}></Route>
            <Route path="/myinvites" element={<MyInvitesPage token={token} isAuthenticated={isAuthenticated} myInfo={myInfo}/>}></Route>
            <Route path="/myfavs/:page" element={<MyLikesPage token={token} isAuthenticated={isAuthenticated} user={userId}/>}></Route>
            <Route path="/myworkspace/:page" element={<MyWorkspacePage token={token} isAuthenticated={isAuthenticated} user={userId}/>}></Route>
            <Route
                path="/dream"
                element={<CreateDreamPage token={token} isAuthenticated={isAuthenticated} />}
            />
            <Route
                path="/mutate/:uuid"
                element={<MutateStablePage mode="mutate" token={token} isAuthenticated={isAuthenticated} />}
            />
            <Route
                path="/edit/:uuid"
                element={<MutateStablePage mode="edit" token={token} isAuthenticated={isAuthenticated} user={userId}/>}
            />
            <Route path="/job-generator" element={<JobGenerator />} />
            <Route path="/gpustatus" element={<GpuStatusPage />} />
            <Route path="/agentstatus/:agent/:page" element={<AgentJobsPage />} />
            <Route path="/following/:page" token={token} element={<FollowingPage token={token} isAuthenticated={isAuthenticated}/>} />
            <Route path="/myprofile" token={token} element={<MyProfile token={token} isAuthenticated={isAuthenticated}/>} />
            <Route path="/myuploads" token={token} element={<MyUploads token={token} isAuthenticated={isAuthenticated}/>} />
        </Routes>
    }
    return(
        <Router>
            <Nav myInfo={myInfo} token={token}/>
                <Box p={5} width={"100%"}>
                    {(()=>{
                        return <>{
                            (()=>{
                                let e = []
                                if(isAuthenticated){
                                    if(myInfo && myInfo.vetted===false){
                                        e.push(<Welcome key={"welcome"} token={token} isAuthenticated={isAuthenticated} user={userId} />)
                                    }
                                    if(myInfo && !myInfo.tosAgree){
                                        e.push(<Terms key={"terms"} tos={myInfo.tos} token={token} isAuthenticated={isAuthenticated} user={userId}/>)
                                    }else{
                                        e.push(routes())
                                    }
                                }else{
                                    e.push(routes())
                                }
                                return e
                            })()
                        }</>
                    })()
                }
            </Box>
        </Router>
    )
}