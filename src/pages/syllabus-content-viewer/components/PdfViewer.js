import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

export default function PdfViewer({ url }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!url) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const renderPDF = async () => {
            const pdf = await pdfjsLib.getDocument(url).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.4 });

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({ canvasContext: context, viewport });
        };

        renderPDF();
    }, [url]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full border rounded-lg shadow"
            style={{ maxHeight: "650px" }}
        ></canvas>
    );
}
