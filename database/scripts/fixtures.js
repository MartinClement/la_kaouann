import { existsSync, mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { parseArgs } from "../../helpers/args.js";
import consolog from "../../helpers/logs.js";

const DEFAULT_OUTPUT_DIR  = "../src";
const DEFAULT_CHUNK_SIZE  = 10;
const DEFAULT_CHUNK_COUNT = 10;

const buildArgs = (_process) => {
  const defaultArgs = {
    outputDir: DEFAULT_OUTPUT_DIR,
    chunkSize: DEFAULT_CHUNK_SIZE,
    chunkCount: DEFAULT_CHUNK_COUNT
  }

  return parseArgs(_process, defaultArgs);
}

const checkOutputDir = (outputDir) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    if (!existsSync(`${__dirname}/${outputDir}`)) {
      mkdirSync(`${__dirname}/${outputDir}`, { recursive: true });
      console.log(`-- Created output directory: ${outputDir}`);
    }
  } catch (error) {
    console.error(`-- Error creating output directory: ${error.message}`);
    process.exit(1);
  }
}

const writeChunkFile = (outputDir, chunk) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const data = JSON.stringify(chunk, null, 2);

  try {
    writeFileSync(`${__dirname}/${outputDir}`, data);
  } catch (error) {
    consolog(`-- Error creating chunk file: ${error.message}`, "red");
  }
};

const buildChunk = (start, size) => {
  return Array.from({ length: size}, (_, index) => ({
    number: index + start,
    question: "Fixture question. The corrext answer is the 3rd one!",
    answers: [
      { value: "First one. Not correct...", correct: false },
      { value: "Second one. Not totally wrong but not correct", correct: false },
      { value: "3rd one. Double check before picking it!", correct: true }
    ]
  }));
};

(() => {
  const ARGS = buildArgs(process);

  if (ARGS.help) {
    console.log("\n\n");
    console.log("FIXTURES - Script:");
    console.log("--help");
    console.log("--outputDir=<path_to_output_dir>");
    console.log("--chunkSize=<chunk_size>");
    console.log("--chunkCount=<chunk_count>");
    console.log("\n\n");

    process.exit(0);
  }

  // PREPARE OUTPUT
  checkOutputDir(ARGS.outputDir);

  try {
    for (let i=1; i < (ARGS.chunkCount * ARGS.chunkSize); i+=ARGS.chunkSize) {
      const chunk = buildChunk(i, ARGS.chunkSize);
  
      writeChunkFile(
        `${ARGS.outputDir}/questions_${i}_${i + ARGS.chunkSize -1}.json`,
        chunk
      );
    }
  } catch(error) {
    consolog(error.message, "red");
  }
})()