const path = require('path');
const fs = require('fs');

async function imageFileUpload(req, image) {
  try {
    const uploadPath = './public/upload/images';

    const ext = path.extname(image.name);
    const fileSize = image.data.length;

    // Create a unique file name by combining the timestamp and removing spaces
    const fileName = `${Date.now()}-${image.name.replace(/\s/g, '')}`;

    // Generate the full file URL using the request's protocol and host
    const fileUrl = `${req.protocol}://${req.get(
      'host'
    )}/upload/images/${fileName}`;

    const allowedTypes = ['.png', '.jpeg', '.jpg'];

    // Check if the uploaded file type is allowed
    if (!allowedTypes.includes(ext.toLowerCase())) {
      throw new Error('Invalid image format!');
    }

    // Check if the file size exceeds 5MB (5,000,000 bytes = 5MB)
    if (fileSize > 5000000) {
      throw new Error('Image size must be less than 5MB!');
    }

    // Move the uploaded file to the specified upload path
    await image.mv(`${uploadPath}/${fileName}`);

    return { fileName, fileUrl };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteFile(filePath, fileName) {
  try {
    const file = `${filePath}${fileName}`;

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  imageFileUpload,
  deleteFile,
};
