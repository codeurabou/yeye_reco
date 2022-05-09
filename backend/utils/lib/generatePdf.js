const puppeteer = require("puppeteer")
const path = require("path")

// Todo : creation d'une bibliotheque de generation de pdf

module.exports = async (
    template = "",
    options = { format: "A4" },
    isDownload = false
) => {
    if (isDownload && !options.path) throw new Error("path est obligatoire")

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // ** pdf logic (content,buffer,path)
    await page.setContent(template)

    const pdfBuffer = await page.pdf(options)

    await page.close()
    await browser.close()

    // path vs buffer
    const resolveLink =
        isDownload && path.resolve("doc", options.path.split("./doc/")[1])
    return isDownload ? resolveLink : pdfBuffer
}
