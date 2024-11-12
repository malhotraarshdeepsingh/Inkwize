# Inkwize- AI Book Generator 📚🤖 
[Demo Video](./demo_video.mp4)

This project was our submission for our first hackathon, where we built an AI-powered book generator! It uses gemini API to generate original books based on user input.


## Tech Stack

**Client:** Next.js, Tailwind CSS

**Server:** Node.js, Express

**PDF Generation**: Puppeteer

**API Integration**: Gemini API for content generation

## Acknowledgements
- Ideation and leadership: Aarav Gupta
- Frontend Development: Shaina Gera, Harshjyot Kaur and Prince Sharma
- Api handling and Backend Developmeny: Arshdeep Singh Malhotra

## Challenges and Lessons Learned

- **API Handling**: Learning how to handle Gemini API calls.

- **PDF Generation with Puppeteer**: I faced challenges in converting .md files to PDF. So i used an alternative method using Puppetter i first converted .md files to HTML and then used Puppeteer to generate a PDF.

- **File Handling Across Frontend and Backend**: I implemented efficient handling of file responses between the backend and frontend.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_OPENAI_API_KEY`

## Run Locally

Clone the project

```bash
  https://github.com/malhotraarshdeepsingh/Inkwize
```

Go to the project directory

```bash
  cd Inkwize
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
