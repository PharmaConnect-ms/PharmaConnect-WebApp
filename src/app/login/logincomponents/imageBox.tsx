'use client'
import React from 'react'
import Image from 'next/image'


const ImageBox = () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <Image src="/signIn.png" alt="login" className="mb-8" width={330} height={330} />
    </div>
  )
}

export default ImageBox
