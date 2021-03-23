import { Request } from "express";
import fs from "fs";
import Jimp = require("jimp");

interface FilterImageFromURLResponse {
  url: string;
  img: Jimp;
}
export async function filterImageFromURL(
  inputURL: string
): Promise<FilterImageFromURLResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const name = `filtered.${Math.floor(Math.random() * 2000)}.jpg`;
      const outpath = `/tmp/${name}`;
      photo
        .resize(256, 256)
        .quality(60)
        .greyscale()
        .write(__dirname + outpath, (error, img: Jimp) => {
          if (error) reject(error);
          resolve({ url: __dirname + outpath, img });
        });
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

const supportedFormat = ["jpeg", "jpg", "png", "/images"];
interface isImageResponse {
  isSupportedFormat: boolean;
  encrypted: boolean;
}
const isImage = (url: string): isImageResponse => {
  const isSupported = supportedFormat.some((val) => url.includes(val));
  return {
    isSupportedFormat: isSupported,
    encrypted: url.includes("/images"),
  };
};

interface isValidUrlResponse {
  isValid: boolean;
  mountedUrl: string;
}
const isValidUrl = (
  req: Request<Record<string, string>>
): isValidUrlResponse => {
  const keys = Object.keys(req.query);
  const mountedUrl = keys.reduce((acc, cur, index) => {
    if (index === 0) {
      return `${req.query[cur]}`;
    }
    return `${acc}&${cur}=${req.query[cur]}`;
  }, "");

  return {
    isValid: keys.length === 1,
    mountedUrl,
  };
};

export const getValidatedUrl = async (
  req: Request<Record<string, string>>
): Promise<string> => {
  const { image_url } = req.query;

  if (!image_url) {
    throw "Missing parameter image_url";
  }

  const isSupportedImage = isImage(image_url as string);
  if (!isSupportedImage.isSupportedFormat) {
    throw "image format not supported";
  }

  if (!isSupportedImage.encrypted) {
    const urlValidation = isValidUrl(req);
    if (!urlValidation.isValid) {
      throw `Invalid URL: ${urlValidation.mountedUrl}`;
    }
  }

  return `${image_url}`;
};
