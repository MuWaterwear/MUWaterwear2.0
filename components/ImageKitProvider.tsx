"use client"

import { IKContext } from 'imagekitio-react'
import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function ImageKitProvider({ children }: Props) {
  return (
    <IKContext
      publicKey="public_y6ZrA8j6R0tjXAQoxCw9S869Bno="
      urlEndpoint="https://ik.imagekit.io/0rtzbgl5y"
      transformationPosition="path"
      authenticationEndpoint="/api/imagekit-auth"
    >
      {children}
    </IKContext>
  )
} 