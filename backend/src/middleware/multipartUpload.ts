import multer from 'multer'
import { MAX_ZIP_SIZE_BYTES } from '../config/constants'

export const multipartUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ZIP_SIZE_BYTES },
})
