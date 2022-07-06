import React from "react"
import { useParams, Link } from "react-router-dom";
import { Button, Text, Flex, Center } from "@chakra-ui/react";
import { Feed } from "./shared/Feed";

export function Search() {
    let params = useParams();

    return <>
        <Center>
            <Flex>
                <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) - 1))}`}>◀️</Link>
                <Center>
                    <Text>{params.page}</Text>
                </Center>
                <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) + 1))}`}>▶️</Link>
            </Flex>
        </Center>          
        <Feed type="search" regexp={params.regexp} amount={params.amount} page={1} />
        <Center>
            <Flex>
                <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) - 1))}`}>◀️</Link>
                <Center>
                    <Text>{params.page}</Text>
                </Center>
                <Link to={`/gallery/${params.user_id}/${params.amount}/${(parseInt(parseInt(params.page) + 1))}`}>▶️</Link>
            </Flex>
        </Center>
    </>
}