import { useEffect, useState } from "react";

interface GeminiHTMLViewerProps {
  url: string | null;
}

export const GeminiHTMLViewer = ({ url }: GeminiHTMLViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const fetchHtml = async () => {
      if (!url) return; // Early exit if URL is null

      try {
        const res = await fetch(url);
        const html = await res.text();
        setHtmlContent(html);
      } catch (err) {
        console.error("Failed to fetch Gemini HTML:", err);
      }
    };

    fetchHtml(); // Ensure it runs on every render
  }, [url]);

  return (
    <div
      className="p-4 rounded text-xs gemini-parser flex flex-col gap-4"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
