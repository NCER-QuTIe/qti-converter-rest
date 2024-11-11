import express from "express";
import bodyParser from "body-parser";
import { Buffer } from "buffer";
import { convertPackageStream } from "@citolab/qti-convert/qti-convert";
import { Readable } from "stream";
import unzipper from "unzipper";

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/convert", async (req, res) => {
  // Get the base64-encoded zip file from the request body
  const base64Zip = req.body.zipFile;
  if (!base64Zip) {
    res.status(400).json({ error: "No zip file provided" });
    return;
  }

  // Decode the base64-encoded zip file
  let zipBuffer;
  try {
    zipBuffer = Buffer.from(base64Zip, "base64");
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to decode base64 zip file" });
    return;
  }

  // Create a readable stream from the zip buffer
  const readable = new Readable();
  readable._read = () => {};
  readable.push(zipBuffer);
  readable.push(null);

  // Unzip the stream
  let inputZipStream;
  try {
    inputZipStream = readable.pipe(unzipper.Parse({ forceStream: true }));
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to parse zip file" });
    return;
  }

  // Convert the QTI package
  let outputBuffer;
  try {
    outputBuffer = await convertPackageStream(inputZipStream);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
    return;
  }

  // Get the base64-encoded zip file
  const processedZipBase64 = outputBuffer.toString("base64");

  res.json({ zipFile: processedZipBase64 });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
