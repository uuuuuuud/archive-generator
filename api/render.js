const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { drive, asli } = req.query;

    if (!drive) {
        return res.status(400).send("Eror: Parameter 'drive' tidak ditemukan.");
    }

    const matches = drive.match(/\/d\/([^/]+)/) || drive.match(/[?&]id=([^&]+)/);
    const fileId = matches ? matches[1] : null;

    if (!fileId) {
        return res.status(400).send("Eror: Tautan Google Drive tidak valid.");
    }

    try {
        const driveResponse = await fetch(`https://docs.google.com/uc?export=download&id=${fileId}`);
        if (!driveResponse.ok) throw new Error('Gagal mengambil data dari Google Drive.');
        const htmlContent = await driveResponse.text();

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Arsip Website Viewer</title>
                <style>
                    body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: sans-serif; }
                    .header-panel { background-color: #1a1a1a; color: #ffffff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #ff4757; height: 35px; position: fixed; top: 0; left: 0; right: 0; z-index: 99999; }
                    .brand { font-size: 20px; font-weight: 900; color: #ff4757; text-transform: uppercase; letter-spacing: 1px; }
                    .btn { background-color: #333; color: #fff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid #444; margin-left: 10px; transition: 0.2s; }
                    .btn:hover { background-color: #ff4757; border-color: #ff4757; }
                    .content-container { margin-top: 62px; padding: 10px; width: 100%; box-sizing: border-box; }
                </style>
            </head>
            <body>
                <div class="header-panel">
                    <div class="brand">ARSIP WEBSITE</div>
                    <div>
                        <a href="${decodeURIComponent(asli || '')}" target="_blank" class="btn" style="${asli ? '' : 'display:none;'}">Menuju Tautan Langsung</a>
                    </div>
                </div>
                <div class="content-container">
                    ${htmlContent}
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send(`Eror internal server: ${error.message}`);
    }
}
