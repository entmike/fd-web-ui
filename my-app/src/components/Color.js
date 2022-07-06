import React from "react"
import { useParams, Link } from "react-router-dom";
import { Text, Flex, Center } from "@chakra-ui/react";
import { Feed } from "./shared/Feed";

export function Color() {
    let params = useParams();

    return <>
        <Center>
            <Flex>
                <Link to={`/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${(parseInt(parseInt(params.page) - 1))}`}>◀️</Link>
                <Center>
                    <Text>{params.page}</Text>
                </Center>
                <Link to={`/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${(parseInt(parseInt(params.page) + 1))}`}>▶️</Link>
            </Flex>
        </Center>
        <Feed type="rgb" r={params.r} g={params.g} b={params.b} range={params.range} amount={params.amount} page={1} />
        <Center>
            <Flex>
                <Link to={`/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${(parseInt(parseInt(params.page) - 1))}`}>◀️</Link>
                <Center>
                    <Text>{params.page}</Text>
                </Center>
                <Link to={`/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${(parseInt(parseInt(params.page) + 1))}`}>▶️</Link>
            </Flex>
        </Center>
    </>
}