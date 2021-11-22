import labelmake from "labelmake";
import pdfExtractor from "@/services/pdfExtractor";

const pdfGenerator = async (inputData) => {
    const FONT = {"Roboto": await fetch(require("@/assets/fonts/Roboto-Regular.ttf")).then((res) => res.arrayBuffer())};
    const BASE_PDF = await fetch(require('@/assets/templates/corona_pasje_v2.pdf')).then((res) => res.arrayBuffer());
    const PAGE_NUMBER = 1;
    const PAGE_SCALE = 1.5;
    const TEMPLATE = {
        fontName: "Roboto",
        basePdf: BASE_PDF,
        schemas: [
            {},
            {
                qr_code: {
                    type: "image",
                    position: {x: 217.115, y: 52.393},
                    width: 50.107,
                    height: 50.107
                },
                initials: {
                    type: "text",
                    position: {x: 123.70, y: 134.3},
                    width: 61,
                    height: 4,
                    fontSize: 9
                },
                birthday: {
                    type: "text",
                    position: {x: 131.0, y: 138.5},
                    width: 50,
                    height: 4,
                    fontSize: 9
                },
                valid_from: {
                    type: "text",
                    position: {x: 130.15, y: 142.73},
                    width: 50,
                    height: 4,
                    fontSize: 9
                },
                valid_to: {
                    type: "text",
                    position: {x: 126.2, y: 146.96},
                    width: 50,
                    height: 4,
                    fontSize: 9
                }
            },
            {}
        ]
    };

    let certificateData = [{
        qr_code: inputData.file,
        initials: inputData.initials,
        birthday: inputData.birthday,
        valid_from: inputData.validFrom,
        valid_to: inputData.validTo
    }]

    // If this key is empty, all others (except for "file") are too.
    // So no need to check all keys.
    if (!inputData.initials) {
        await pdfExtractor(inputData.file, PAGE_NUMBER, PAGE_SCALE).then((res) => {
            if (Object.values(res).some(x => !x)) {
                throw new Error("Tenminste één benodigd veld is niet gevonden. Probeer het nogmaals of maak gebruik van de handmatige invoermethode.");
            }

           certificateData[0] = res;
        });
    }

    const pdf = await labelmake({template: TEMPLATE, inputs: certificateData, font: FONT});
    return new Blob([pdf.buffer], {type: "application/pdf"});
};

export default pdfGenerator
