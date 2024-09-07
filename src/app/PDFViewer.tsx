import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isDarkMode: boolean;
  fontSize: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  currentPage,
  setCurrentPage,
  isDarkMode,
  fontSize,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: "cmaps/",
          cMapPacked: true,
        }}
      >
        <Page
          pageNumber={currentPage}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          customTextRenderer={({ str, itemIndex }) => (
            <span
              key={itemIndex}
              style={{
                color: isDarkMode ? "#e0e0e0" : "#333333",
                fontSize: `${fontSize}px`,
              }}
            >
              {str}
            </span>
          )}
        />
      </Document>
      <p>
        Страница {currentPage} из {numPages}
      </p>
    </div>
  );
};

export default PDFViewer;
