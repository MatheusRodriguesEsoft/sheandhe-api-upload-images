"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadHandler = exports.uploadController = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const uploadController = (req, res) => {
    upload.array('files', 10)(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(500).json({ error: 'Multer Error' });
        }
        return (0, exports.uploadHandler)(req, res);
    });
};
exports.uploadController = uploadController;
const uploadHandler = async (req, res) => {
    try {
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_DEFAULT_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const uploadedFiles = [];
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                const { originalname: key, buffer: Body, mimetype: ContentType } = file;
                const params = {
                    Bucket: BUCKET_NAME,
                    Key: `${timestamp}-${key}`,
                    Body,
                    ContentType,
                };
                await s3Client.send(new client_s3_1.PutObjectCommand(params));
                const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
                const fileName = params.Key;
                uploadedFiles.push({ fileUrl, fileName });
            }
        }
        else {
            for (const file of Object.values(req.files)) {
                for (const individualFile of file) {
                    const { originalname: key, buffer: Body, mimetype: ContentType, } = individualFile;
                    const params = {
                        Bucket: BUCKET_NAME,
                        Key: `${timestamp}-${key}`,
                        Body,
                        ContentType,
                    };
                    await s3Client.send(new client_s3_1.PutObjectCommand(params));
                    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
                    const fileName = params.Key;
                    uploadedFiles.push({ fileUrl, fileName });
                }
            }
        }
        return res.json(uploadedFiles);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.uploadHandler = uploadHandler;
//# sourceMappingURL=uploadController.js.map