"use client";
import React, { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const [bookTitle, setBookTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [chapters, setChapters] = useState("");
  const [wordsPerChapter, setWordsPerChapter] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [authorPreference, setAuthorPreference] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPdfGenerated(false);
    
    try {
      // Prepare the request body as JSON
      const requestBody = {
        title: bookTitle,
        topic: topic,
        chapters: parseInt(chapters),
        num_words: parseInt(wordsPerChapter),
        target_audience: targetAudience,
        author: authorPreference,
        book_description: description,
      };
      // console.log("Request Body: ", requestBody);

      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), 
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${bookTitle}_book.pdf`; 
      link.click(); 

      setPdfGenerated(true);
      setDownloadLink(link.href);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
      setBookTitle("");
      setTopic("");
      setChapters("");
      setWordsPerChapter("");
      setTargetAudience("");
      setAuthorPreference("");
      setDescription("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-700 min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl transition-colors duration-300">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Book PDF Generator
          </h1>
        </div>

        <form
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            <div>
              <label
                htmlFor="bookTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Book Title:
              </label>
              <input
                type="text"
                id="bookTitle"
                name="bookTitle"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Book Genre:
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="chapters"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Chapters:
              </label>
              <input
                type="number"
                id="chapters"
                name="chapters"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4">
            <div>
              <label
                htmlFor="wordsPerChapter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Words per chapter:
              </label>
              <input
                type="number"
                id="wordsPerChapter"
                name="wordsPerChapter"
                value={wordsPerChapter}
                onChange={(e) => setWordsPerChapter(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="targetAudience"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Target Audience:
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="authorPreference"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Preferred Author Style:
              </label>
              <input
                type="text"
                id="authorPreference"
                name="authorPreference"
                value={authorPreference}
                onChange={(e) => setAuthorPreference(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Stephen King, J.K. Rowling"
              />
            </div>
          </div>
        </form>

        {/* Description Field (Full Width) */}
        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Book Description:
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Briefly describe your book idea..."
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Generate PDF
        </button>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Generating your book PDF...
            </p>
          </div>
        )}

        {pdfGenerated && (
          <div className="mt-4 text-center">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              PDF generated successfully!
            </p>
            <a
              href={downloadLink}
              className="text-blue-500 dark:text-blue-400 hover:underline"
              download
            >
              Download Your Book PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
