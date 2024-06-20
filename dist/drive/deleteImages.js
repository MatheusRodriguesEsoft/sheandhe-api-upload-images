"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteController = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const deleteController = async (req, res) => {
    try {
        const { fileName } = req.params;
        if (!fileName) {
            return res.status(400).json({ error: 'Missing fileName parameter' });
        }
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_DEFAULT_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
        };
        await s3Client.send(new client_s3_1.DeleteObjectCommand(params));
        return res.json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteController = deleteController;
//# sourceMappingURL=deleteImages.js.map