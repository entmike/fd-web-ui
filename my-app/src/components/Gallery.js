import React from "react"
import { useParams, Link } from "react-router-dom";
import { Text, Flex, Center } from "@chakra-ui/react";
import { Feed } from "./shared/Feed";

export function Gallery() {
    const params = useParams();

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