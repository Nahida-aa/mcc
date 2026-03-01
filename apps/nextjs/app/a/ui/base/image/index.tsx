"use client"
import { Image as HerouiImage } from "@heroui/react";
import NextImage from 'next/image';

export const Image = (props: React.ComponentProps<typeof HerouiImage>) => {
  const { as, alt, ...rest } = props;
  return <HerouiImage alt={alt || 'img'} as={NextImage} {...rest} />
}

Image.displayName = 'Image';