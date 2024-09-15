import { v4 as uuidv4 } from 'uuid'

export function generateHashNameFile(extname: string) {
    const uniqueString = uuidv4();

    return `${uniqueString}-${new Date().getTime()}.${extname}`
}