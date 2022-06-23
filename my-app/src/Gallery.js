import React from "react"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Feed from "./Feed";

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

    return <>
        <Feed user={params.user_id} amount={params.amount} />
    </>
}