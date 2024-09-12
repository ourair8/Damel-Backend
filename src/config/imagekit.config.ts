import ImageKit from 'imagekit'

console.log(Bun.env.IMAGEKIT_PUBLIC_KEY)

export const imagekit = new ImageKit({
    publicKey: String(Bun.env.IMAGEKIT_PUBLIC_KEY),
    privateKey: String(Bun.env.IMAGEKIT_PRIVATE_KEY),
    urlEndpoint: String(Bun.env.IMAGEKIT_URL_ENDPOINT),
  })
