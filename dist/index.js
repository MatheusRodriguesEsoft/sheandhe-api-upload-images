"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const deleteImages_1 = require("./drive/deleteImages");
const uploadController_1 = require("./drive/uploadController");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    return res.send('API SHE&HE Upload Images');
});
app.post('/upload', uploadController_1.uploadController);
app.delete('/delete/:fileName', deleteImages_1.deleteController);
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map