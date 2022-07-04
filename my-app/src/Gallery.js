import React from "react"
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Feed from "./Feed";
import { Button, Text, Flex, Center } from "@chakra-ui/react";

export default function Gallery() {
    let params = useParams();

    return <>
        <Flex>
            <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) - 1))}`}>◀️</Link>
            <Center>
                <Text>{params.page}</Text>
            </Center>
            <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) + 1))}`}>▶️</Link>
        </Flex>            
        <Feed user={params.user_id} amount={params.amount} page={1} />
    </>
}