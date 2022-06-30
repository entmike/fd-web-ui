import React from "react"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Feed from "./Feed";
import { Button, Text, Flex, Center } from "@chakra-ui/react";

export default function Gallery() {
    let params = useParams();

    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    
    // function fetchGallery() {
    //   let user_id = params.user_id
    //   fetch(`https://api.feverdreams.app/userfeed/${user_id}/50`)
    //   .then((response) => {
    //     let obj = response.json()
    //     return obj
    //   })
    //   .then((actualData) => {
    //     console.log(actualData)
    //     setData(actualData);
    //     setError(null);
    //   })
    //   .catch((err) => {
    //     setError(err.message);
    //     setData(null);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    // }
    
    // useEffect(() => {
    //     fetchGallery()
    // },[]);
    function go(direction) {
        if (parseInt(params.page) + direction > 0) {
            window.location.href=(`/gallery/${params.user_id}/${params.amount}/${(parseInt(params.page) + direction)}`)
        }
    }
    
    const goToPage = (page) => {
        window.location.href=(`/gallery/${params.user_id}/${params.amount}/${page}`)
    }

    const handleBlur = (e) => {
        let page = parseInt(e.target.innerHTML)
        let bConform = false

        if (!isNaN(page)) {
            if (page !== 0) { bConform = true }
        } 
        bConform ? goToPage( page ) : document.getElementById('pageNum').innerHTML = params.page
        
    };
    const handleKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            
            let page = parseInt(document.getElementById('pageNum').innerHTML)
            let bConform = false
            
            if (!isNaN(page)) {
                if (page !== 0) { bConform = true }
            }
            bConform ? goToPage( page ) : document.getElementById('pageNum').innerHTML = params.page
        }
    };

    return <>
        <Flex>
            <Button onClick={()=>go(-1)}>⬅️</Button>
            <Center>
                <div id="pageNum" onBlur={handleBlur} onKeyDown={handleKeyDown} contentEditable>
                    {params.page}
                </div>
            </Center>
            <Button onClick={()=>go(1)}>➡️</Button>
        </Flex>            
        <Feed user={params.user_id} amount={params.amount} page={1} />
    </>
}