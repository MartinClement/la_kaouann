import got from "got";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { parseArgs } from "./helpers/args.js";
import consolog from "./helpers/logs.js";

const CONFIG = {
  URL: "https://www.rollerderbytestomatic.fr/question/",
  DELAY: 500,
  CHUNK_SIZE: 10
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const scrape = async (url) => {
  console.log("Scrapping - " + url);
  const html = await got(url).text();
  const $ = cheerio.load(html);

  if ($("div.question-content").length === 0) {
    return;
  }

  const question = $("p.question-text").text();
  const answers = [];
  
  $("ol[type='A'] li a").each((_, el) => {
    answers.push({
      value: $(el).text(),
      correct: $(el).hasClass("correct_answer_link")
    });
  });

  return { question, answers};
};

const run = async (index, end, delay = 1000, acc = []) => {
  if (index > end) {
    return acc;
  }

  const target = `${CONFIG.URL}${index}`;
  const scrappedQuestion = await scrape(target);

  if (scrappedQuestion) {
    acc.push({ number: index, ...scrappedQuestion });
    consolog("✔️ - Question Found", "green");
  } else {
    consolog("❌ - Question Not Found", "red");

  }

  await sleep(delay);

  return run(index + 1, end, delay, acc);
};

(async () => {
  const args = parseArgs(process);

  if (args.help || args.h) {
    console.log(`SCRAPPER: Scraps questions from "${CONFIG.URL}".`);
    console.log(`--help   -h: Display this message`);
    console.log(`--chunk    : Define chunks to be scrapped (default chunk size: ${CONFIG.CHUNK_SIZE})`);

    process.exit(0);
  }
  
  if (!args.chunks) {
    console.error("MISSING PARAM: --chunks");

    process.exit(1);
  }

  for (let chunkIndex = 0; chunkIndex < args.chunks; chunkIndex++) {
    let chunkStart = CONFIG.CHUNK_SIZE * chunkIndex;
    let chunkEnd   = chunkStart + CONFIG.CHUNK_SIZE;

    const scrappedChunk = await run(chunkStart + 1, chunkEnd, CONFIG.DELAY);

    consolog(`CHUNK [${chunkIndex}] SCRAPPED -- Questions ${chunkStart + 1} -> ${chunkEnd}`, "cyan");

    writeFileSync(
      `${__dirname}/chunks/questions_${chunkStart + 1}_${chunkEnd}.json`,
      JSON.stringify(scrappedChunk)
    );
  }
})();
