import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import fsextra from "fs-extra";
import { marked } from "marked";
import puppeteer from "puppeteer";

// Initialize the Gemini model
const gemini = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_OPENAI_API_KEY!);

export const runtime = "nodejs";

interface ChapterInfo {
  chapter: string;
  subtopic: string;
}

// Helper function to generate chapters for the eBook
async function getChaptersArray(
  title: string,
  topic: string,
  chapters: number,
  target_audience: string
): Promise<ChapterInfo[]> {
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chaptersArray: ChapterInfo[] = [];

  for (let idx = 0; idx < chapters; idx++) {
    const prompt = `For our eBook titled ${title}, which covers the topic ${topic}, we need a description for chapter ${idx + 1
      }. Our target audience is ${target_audience}. Provide a title and a brief overview for this chapter that outlines its focus and the key points it will cover.`;

    try {
      const response = await model.generateContent([prompt]);
      const chapterInfo =
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No description available";

      chaptersArray.push({
        chapter: `Chapter ${idx + 1}`,
        subtopic: chapterInfo,
      });
    } catch (error: any) {
      console.error(
        `Error generating chapter ${idx + 1} details:`,
        error.message
      );
      chaptersArray.push({
        chapter: `Chapter ${idx + 1}`,
        subtopic: "Error generating content.",
      });
    }
  }

  return chaptersArray;
}

// Main POST handler for generating the full eBook content
export async function POST(req: Request) {
  const {
    title,
    topic,
    chapters,
    num_words,
    target_audience,
    author,
    book_description,
  } = await req.json();

  // Generate chapter descriptions
  const chaptersArray = await getChaptersArray(
    title,
    topic,
    chapters,
    target_audience
  );

  let chapterContext = "";
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
  const maxRetries = 3

  // Loop through chapters and generate detailed content for each
  for (let idx = 0; idx < chaptersArray.length; idx++) {
    const { chapter, subtopic } = chaptersArray[idx];
    let success = false;
    let attempts = 0;

    while (!success && attempts < maxRetries) {
      const prompt = `We are writing an eBook called ${title}. Overall, it is about ${topic}. Our reader is: ${target_audience}. Please follow the book description to generate the content: ${book_description}. We are currently writing the ${idx + 1
        } section for the chapter: ${chapter}. The previous sections covered: ${chapterContext}. Write at least ${num_words} words, with quantitative facts and statistics, in a cohesive paragraph format. Act like ${author} and avoid hallucinations. Differentiate each chapter with proper numbering and heading.`;

      try {
        const response = await model.generateContent([prompt]);
        const text =
          response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No content generated.";
        chapterContext += `\n\n${text}`;
        success = true;
      } catch (error: any) {
        attempts++;
        console.error(
          `Error generating content for chapter ${idx + 1} (Attempt ${attempts}):`,
          error.message
        );
        if (attempts >= maxRetries) {
          chapterContext += `\n\nError generating content for ${chapter}.`;
        }
      }
    }
  }

  const markdownPath = path.join(
    process.cwd(),
    "output",
    `${title.replace(/\s+/g, "_")}.md`
  );

  if (!fs.existsSync(path.dirname(markdownPath))) {
    fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  }

  fs.writeFile(markdownPath, chapterContext, (err) => {
    if (err) {
      console.error("Error writing Markdown file:", err);
    } else {
      console.log(`Markdown file saved at: ${markdownPath}`);
    }
  });

  const pdfPath = path.join(
    process.cwd(),
    "output",
    `${title.replace(/\s+/g, "_")}.pdf`
  );

  const markdownContent = await fsextra.readFile(markdownPath, 'utf-8')

  const htmlContent = await marked(markdownContent)

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);

  await page.pdf({
    path: pdfPath, 
    format: 'A4',  
    margin: { top: '20mm', left: '20mm', bottom: '20mm', right: '20mm' },
  });

  await browser.close();

  const pdfBuffer = fs.readFileSync(pdfPath);

  const response = new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf', 
      'Content-Disposition': `attachment; filename="${path.basename(pdfPath)}"`, 
    },
  });

  fs.unlinkSync(markdownPath);
  fs.unlinkSync(pdfPath);

  return response;
}
