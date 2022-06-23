import React from "react"
import { useParams } from "react-router-dom";
export default function Gallery() {
    let params = useParams();
    return <h2>{params.user}</h2>;
}