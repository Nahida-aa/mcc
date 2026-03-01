import { SignJWT, jwtVerify } from 'jose'
import { env } from '../env'

const secretKey = env.BETTER_AUTH_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15minutes')
    .sign(encodedKey)
}

export async function decrypt(session?: string) {
  if (!session) return
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}