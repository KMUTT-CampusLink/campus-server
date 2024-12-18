import minioClient from "../config/minioConfig.js";
import { PassThrough } from "stream";
import crypto from "crypto";

function getFilename(req, file, cb) {
  crypto.randomBytes(16, function (err, raw) {
    cb(err, err ? undefined : raw.toString("hex"));
  });
}

function getDestination(req, file, cb) {
  cb(
    null,
    file.mimetype.startsWith("image")
      ? "img"
      : file.mimetype.startsWith("video")
        ? "vd"
        : "doc"
  );
}

function CustomStorageMinIO(opts) {
  this.bucketName = opts.bucketName;
  this.getFilename = opts.filename || getFilename;
  this.getDestination = opts.destination || getDestination;
}

CustomStorageMinIO.prototype._handleFile = function _handleFile(req, file, cb) {
  let that = this;
  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err);
    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err);

      // if file mime type is an image, destination will be img/, otherwise vd/
      const objName = destination + filename;
      const minioStream = new PassThrough();
      minioClient.putObject(
        that.bucketName,
        objName,
        minioStream,
        null,
        { "Content-Type": file.mimetype },
        (err, etag) => {
          if (err) cb(err);
          cb(null, {
            objName: objName,
            etag: etag,
          });
        }
      );
      file.stream.pipe(minioStream);
    });
  });
};

CustomStorageMinIO.prototype._removeFile = function _removeFile(req, file, cb) {
  minioClient.removeObject(this.bucketName, file.objName);
};

export default function (opts) {
  return new CustomStorageMinIO(opts);
}
