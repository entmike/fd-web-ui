import React from 'react';
import JSONPretty from 'react-json-pretty';
import { useDisclosure } from '@chakra-ui/react'
import {
  Button,
  Link,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

export function PreviewDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const yourData = [

    {
      "_id": {
        "$oid": "62cb8aefa3848b37c5cd9471"
      },
      "uuid": "e465410a-a163-4b68-81e8-0e3fe4ef84fb",
      "render_type": "dream",
      "nsfw": "no",
      "agent_id": "runpod-yb3u466n73fp01",
      "text_prompt": "tarot card, intricate skeleton grim reaper god of death by ross tran, black, golden ratio, scythe, vivid colors and Black forest, trending on ArtStation, cgsociety gustav klimt sickle scythe",
      "steps": 300,
      "shape": "pano",
      "model": "vitl14",
      "clip_guidance_scale": 7500,
      "diffusion_model": "512x512_diffusion_uncond_finetune_008100",
      "clamp_max": 0.05,
      "cut_ic_pow": 1,
      "cutn_batches": 4,
      "sat_scale": 0,
      "set_seed": -1,
      "cut_schedule": "default",
      "author": 388012891514863626,
      "status": "archived",
      "timestamp": {
        "$date": "2022-07-11T02:29:03.164Z"
      },
      "last_preview": {
        "$date": "2022-07-11T02:29:03.164Z"
      },
      "mem_hwm": 25325,
      "percent": 100,
      "preview": true,
      "dominant_color": [
        56,
        46,
        62
      ],
      "palette": [
        [
          56,
          46,
          62
        ],
        [
          224,
          206,
          199
        ],
        [
          135,
          105,
          105
        ],
        [
          161,
          157,
          167
        ],
        [
          151,
          146,
          164
        ]
      ],
      "indexed": true,
      "thumbnails": [
        64,
        128,
        256,
        512,
        1024
      ],
      "jpg": true,
      "duration": 1227.9460802078247,
      "filename": "e465410a-a163-4b68-81e8-0e3fe4ef84fb0_0.png",
      "config": "e465410a-a163-4b68-81e8-0e3fe4ef84fb_gen.yaml",
      "views": 7,
      "author_bigint": 388012891514863626,
      "userdets": {
        "_id": {
          "$oid": "62c5e9d3566fd87413f326d7"
        },
        "user_id": 388012891514863626,
        "avatar": "https://cdn.discordapp.com/avatars/388012891514863626/64ab3420b60f062bf59f0de86a6259b5.png?size=1024",
        "discriminator": "1352",
        "display_name": "thediligent",
        "nick": null,
        "user_name": "thediligent",
        "last_seen": {
          "$date": "2022-07-10T17:16:00.299Z"
        },
        "user_str": "388012891514863626"
      }
    }
  ]
  return (
    <>
      <Link pt="5" ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open Job Details Drawer
      </Link>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size="lg"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Job Details</DrawerHeader>

          <DrawerBody>
            <JSONPretty id="json-pretty" data={yourData}></JSONPretty>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}