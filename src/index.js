// src/index.js
import express from "express";
import bodyParser from "body-parser";
import { Buffer } from "buffer";
import { convertPackageStream } from "@citolab/qti-convert/qti-convert";
import { Readable } from "stream";
import JSZip from "jszip";
import { splitStimulus } from "./split-stimulus.js"; // Ensure the .js extension
import { promises as fs } from 'fs';

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/test1", (req, res) => {
  const sampleXmlNoDelimiter = `
<assessmentItem>
  <itemBody>
    <p>Introduction to the question.</p>
    <choiceInteraction>
      <prompt>~~~</prompt>
    </choiceInteraction>
    <p>Details about the question.</p>
  </itemBody>
</assessmentItem>
`;

  const modifiedXmlNoDelimiter = splitStimulus(sampleXmlNoDelimiter);
  console.log(modifiedXmlNoDelimiter);
  res.write(modifiedXmlNoDelimiter);
  res.end();
});

app.get("/test3", (req, res) => {
  const sampleXmlNoDelimiter = `
<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2" xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2 http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2.xsd" identifier="i17211422180235216002743966" title="ლონდონის თვალი - 2" label="ლონდონის თვალი - 2" xml:lang="ka-GE" adaptive="false" timeDependent="false" toolName="TAO" toolVersion="2022.11">
  <responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
    <correctResponse>
      <value><![CDATA[choice_3]]></value>
    </correctResponse>
  </responseDeclaration>
  <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" normalMaximum="1"/>
  <outcomeDeclaration identifier="MAXSCORE" cardinality="single" baseType="float">
    <defaultValue>
      <value>1</value>
    </defaultValue>
  </outcomeDeclaration>
  <stylesheet href="style/custom/tao-user-styles.css" type="text/css" media="all" title=""/>
  <itemBody>
    <div class="grid-row">
      <div class="col-12">
        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1" minChoices="0" orientation="vertical">
          <prompt>
            <p class="txt-ctr">
              <span>
                <strong>ლონდონის თვალი</strong>
              </span>
            </p>
            <p>ლონდონში, მდინარე ტემზის გასწვრივ, დგას უზარმაზარი ეშმაკის ბორბალი – სახელად ლონდონის თვალი. იხილეთ ქვემოთ  მოცემული  სურათი და დიაგრამა.</p>
            <p>
              <img src="London_eye.jpg" alt="London_eye" width="85%" border_size="" border_color="" type="image/jpeg"/>
            </p>
            <p>ეშმაკის ბორბლის გარე დიამეტრი 140 მეტრია, ხოლო მისი უმაღლესი წერტილი მდინარე ტემზის  ფსკერზე 150 მეტრით მაღლაა. ბორბალი  ბრუნავს  დიაგრამაზე ისრებით ნაჩვენები მიმართულებით.</p>
            <p>
              <strong>შეკითხვა 2:</strong>
            </p>
            <p>ეშმაკის ბორბალი მუდმივი სიჩქარით ბრუნავს. ბორბალი ერთ სრულ ბრუნს ზუსტად 40 წუთში ასრულებს.</p>
            <p>ჯონი ეშმაკის ბორბალზე ტრიალს ჩასხდომის  P  წერტილიდან  იწყებს. </p>
            <p>სად იქნება ჯონი ნახევარი საათის შემდეგ?</p>
            <p> </p>
          </prompt>
          <simpleChoice identifier="choice_1" fixed="true" showHide="show"> R  წერტილში;</simpleChoice>
          <simpleChoice identifier="choice_2" fixed="true" showHide="show">R  და S  წერტილებს შორის;</simpleChoice>
          <simpleChoice identifier="choice_3" fixed="true" showHide="show">S  წერტილში;</simpleChoice>
          <simpleChoice identifier="choice_4" fixed="true" showHide="show">S   და  P წერტილებს შორის.</simpleChoice>
        </choiceInteraction>

        <choiceInteraction>
          <prompt>~~~<prompt>
        </choiceInteraction>
        
        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1" minChoices="0" orientation="vertical">
          <prompt>
            <p class="txt-ctr">
              <span>
                <strong>ლონდონის თვალი</strong>
              </span>
            </p>
            <p>ლონდონში, მდინარე ტემზის გასწვრივ, დგას უზარმაზარი ეშმაკის ბორბალი – სახელად ლონდონის თვალი. იხილეთ ქვემოთ  მოცემული  სურათი და დიაგრამა.</p>
            <p>
              <img src="London_eye.jpg" alt="London_eye" width="85%" border_size="" border_color="" type="image/jpeg"/>
            </p>
            <p>ეშმაკის ბორბლის გარე დიამეტრი 140 მეტრია, ხოლო მისი უმაღლესი წერტილი მდინარე ტემზის  ფსკერზე 150 მეტრით მაღლაა. ბორბალი  ბრუნავს  დიაგრამაზე ისრებით ნაჩვენები მიმართულებით.</p>
            <p>
              <strong>შეკითხვა 2:</strong>
            </p>
            <p>ეშმაკის ბორბალი მუდმივი სიჩქარით ბრუნავს. ბორბალი ერთ სრულ ბრუნს ზუსტად 40 წუთში ასრულებს.</p>
            <p>ჯონი ეშმაკის ბორბალზე ტრიალს ჩასხდომის  P  წერტილიდან  იწყებს. </p>
            <p>სად იქნება ჯონი ნახევარი საათის შემდეგ?</p>
            <p> </p>
          </prompt>
          <simpleChoice identifier="choice_1" fixed="true" showHide="show"> R  წერტილში;</simpleChoice>
          <simpleChoice identifier="choice_2" fixed="true" showHide="show">R  და S  წერტილებს შორის;</simpleChoice>
          <simpleChoice identifier="choice_3" fixed="true" showHide="show">S  წერტილში;</simpleChoice>
          <simpleChoice identifier="choice_4" fixed="true" showHide="show">S   და  P წერტილებს შორის.</simpleChoice>
        </choiceInteraction>
      </div>
    </div>
  </itemBody>
  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/>
</assessmentItem>

`;

  const modifiedXmlNoDelimiter = splitStimulus(sampleXmlNoDelimiter);
  console.log(modifiedXmlNoDelimiter);
  res.write(modifiedXmlNoDelimiter);
  res.end();
});



app.get("/test2", (req, res) => {
  const sampleXmlNoDelimiter = `
<assessmentItem>
  <itemBody>
    <p>First part of the content.</p>
    <choiceInteraction>
      <prompt>Question 1</prompt>
    </choiceInteraction>
    <choiceInteraction>
      <prompt>~~~</prompt>
    </choiceInteraction>
    <choiceInteraction>
      <prompt>Question 2</prompt>
    </choiceInteraction>
    <p>Second part of the content.</p>
  </itemBody>
</assessmentItem>
`;

  const modifiedXmlNoDelimiter = splitStimulus(sampleXmlNoDelimiter);
  console.log(modifiedXmlNoDelimiter);
  res.write(modifiedXmlNoDelimiter);
  res.end();
});

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

  // Load the zip buffer into JSZip
  let zip;
  try {
    zip = await JSZip.loadAsync(zipBuffer);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to parse zip file" });
    return;
  }

  // Recursively search for "qti.xml" files and modify their contents
  const processZip = async (zip) => {
    const files = Object.keys(zip.files);
    for (const filename of files) {
      const file = zip.files[filename];
      if (!file.dir && filename.endsWith("qti.xml")) {
        try {
          const content = await file.async("string");
          const modifiedContent = splitStimulus(content);
          zip.file(filename, modifiedContent);
        } catch (error) {
          console.error(`Error processing ${filename}:`, error);
          res.status(500).json({ error: `Failed to process ${filename}` });
          return;
        }
      }
    }
  };

  await processZip(zip);

  // Generate the modified zip buffer
  let modifiedZipBuffer;
  try {
    modifiedZipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to generate modified zip file" });
    return;
  }

  // Create a readable stream from the modified zip buffer
  const modifiedZipStream = new Readable();
  modifiedZipStream._read = () => {};
  modifiedZipStream.push(modifiedZipBuffer);
  modifiedZipStream.push(null);

  // Convert the QTI package
  let outputBuffer;
  try {
    outputBuffer = await convertPackageStream(modifiedZipStream);
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
/*

<itemBody>
  <div class="grid-row">
    <div class="col-12">
      <choiceI
    </div>
  </div>
</itemBody>

*/