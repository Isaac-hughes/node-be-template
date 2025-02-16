/* eslint-disable no-undef */
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadProfilePicture(imageBase64, mimeType, fileName) {
    const buffer = Buffer.from(imageBase64, "base64");

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `profile-pictures/${fileName}`, // You can customize the folder structure as needed
      Body: buffer,
      ContentEncoding: "base64", // optional, to indicate the file is base64-encoded
      ContentType: mimeType,
    };

    try {
      const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
      return data;
    } catch (err) {
      console.error("Error", err);
      throw err;
    }
  }

  async deleteProfilePicture(fileName) {
    const bucketName = process.env.AWS_BUCKET_NAME;

    const deleteParams = {
      Bucket: bucketName,
      Key: `profile-pictures/${fileName}`,
    };

    try {
      const data = await this.s3Client.send(
        new DeleteObjectCommand(deleteParams)
      );
      return data;
    } catch (err) {
      console.error("Error deleting profile picture", err);
      throw new Error("Error deleting profile picture from S3: " + err.message);
    }
  }
}

module.exports = S3Service;
