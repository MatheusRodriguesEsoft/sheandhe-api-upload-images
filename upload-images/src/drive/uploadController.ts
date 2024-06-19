import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import multer from 'multer'

dotenv.config()

interface ObjectFile {
  fileUrl: string
  fileName: string
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const uploadController = (req: Request, res: Response) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer Error:', err)
      return res.status(500).json({ error: 'Multer Error' })
    }
    uploadHandler(req, res)
  })
}

export const uploadHandler = async (req: Request, res: Response) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const currentDate = new Date()
    const timestamp = currentDate.toISOString()

    const s3Client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    })

    const uploadedFiles: ObjectFile[] = []

    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        const { originalname: key, buffer: Body, mimetype: ContentType } = file

        const params = {
          Bucket: BUCKET_NAME,
          Key: `${timestamp}-${key}`,
          Body,
          ContentType,
        }

        await s3Client.send(new PutObjectCommand(params))

        const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`
        const fileName = params.Key

        uploadedFiles.push({ fileUrl, fileName })
      }
    } else {
      for (const file of Object.values(req.files)) {
        for (const individualFile of file) {
          const {
            originalname: key,
            buffer: Body,
            mimetype: ContentType,
          } = individualFile

          const params = {
            Bucket: BUCKET_NAME,
            Key: `${timestamp}-${key}`,
            Body,
            ContentType,
          }

          await s3Client.send(new PutObjectCommand(params))

          const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`
          const fileName = params.Key

          uploadedFiles.push({ fileUrl, fileName })
        }
      }
    }

    return res.json(uploadedFiles)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
