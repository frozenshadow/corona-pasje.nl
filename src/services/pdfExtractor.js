import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
import jsQR from "jsqr";

const pdfExtractor = async (inputFile, pageNumber, pageScale) => {
    const WORD_LOOKUP_TABLE = {
        initials: "Initialen: ",
        birthday: "Geboortedag: ",
        valid_from: "Geldig vanaf: ",
        valid_to: "Geldig tot: ",
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

    const loadingTask = pdfjsLib.getDocument({url: inputFile});
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({scale: pageScale});
    const pageCanvas = document.createElement('canvas') , pageCtx = pageCanvas.getContext('2d');
    const renderContext = { canvasContext: pageCtx, viewport: viewport };
    const textContent = await page.getTextContent();

    pageCanvas.height = viewport.height;
    pageCanvas.width = viewport.width;

    // Search the input PDF for words from the lookup table,
    // and populate a new object array with the results.
    let result = Object.fromEntries(
        Object.entries(WORD_LOOKUP_TABLE).map(([k, v]) => {
            let textItem = textContent.items.find(textItem => textItem.str.startsWith(v));
            return textItem ? [k, textItem['str'].split(v)[1]] : [k, null];
        })
    );

    // Extract the QR code by rendering the PDF to a image and using image recognition
    result['qr_code'] = await page.render(renderContext).promise.then(() => {
        const pageImage = pageCanvas.getContext('2d').getImageData(0, 0, pageCanvas.width, pageCanvas.height);
        const qrCode = jsQR(pageImage.data, pageCanvas.width, pageCanvas.height);

        const qrCanvas = document.createElement('canvas');
        const qrCtx = qrCanvas.getContext('2d');

        // If there is a QR code found, render it to a virtual canvas and crop it.
        if (qrCode) {
            qrCanvas.width = (qrCode.location.bottomRightCorner.x - qrCode.location.topLeftCorner.x) + 3;
            qrCanvas.height = (qrCode.location.bottomRightCorner.y - qrCode.location.topLeftCorner.y) + 3;

            qrCtx.putImageData(
                pageImage,
                -qrCode.location.topLeftCorner.x + 1,
                -qrCode.location.topLeftCorner.y + 1,
                qrCode.location.topLeftCorner.x,
                qrCode.location.topLeftCorner.y,
                qrCanvas.width,
                qrCanvas.height
            );
        } else {
            throw new Error('PDF bevat geen QR-code of is van een onbekend type.');
        }

        return qrCanvas.toDataURL();
    });

    return result;
}

export default pdfExtractor
