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
                    
                    /* PANEL ATAS: Tebal 2x lipat (70px), Latar Abu-abu Arang, Border Oranye Tua */
                    .header-panel { 
                        background-color: #2f3542; 
                        color: #ffffff; 
                        padding: 0 30px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: space-between; 
                        border-bottom: 4px solid #b33939; 
                        height: 70px; 
                        position: fixed; 
                        top: 0; 
                        left: 0; 
                        right: 0; 
                        z-index: 99999; 
                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    }
                    
                    /* TULISAN UTAMA: Menyesuaikan jadi besar dan berwarna Oranye Terang Kontras */
                    .brand { 
                        font-size: 26px; 
                        font-weight: 900; 
                        color: #ff5252; 
                        text-transform: uppercase; 
                        letter-spacing: 2px; 
                    }
                    
                    /* TOMBOL UTAMA */
                    .btn { 
                        background-color: #ff793f; 
                        color: #fff; 
                        padding: 12px 20px; 
                        border-radius: 6px; 
                        text-decoration: none; 
                        font-size: 14px; 
                        font-weight: 700; 
                        border: 1px solid #cd6133; 
                        margin-left: 12px; 
                        transition: 0.2s; 
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    }
                    .btn:hover { 
                        background-color: #cd6133; 
                        border-color: #b33939; 
                    }
                    
                    /* KONTEN WEB: Jarak turun menyesuaikan ketebalan panel baru */
                    .content-container { 
                        margin-top: 74px; 
                        padding: 15px; 
                        width: 100%; 
                        box-sizing: border-box; 
                    }
                </style>
            </head>
            <body>
                <div class="header-panel">
                    <div class="brand">
                        <a href="https://arsiparis-web.vercel.app/" target="_blank" style="text-decoration: none; color: inherit;">🚀 ARSIP WEBSITE</a>
                    </div>
                    <div>
                        <a href="${decodeURIComponent(asli || '')}" target="_blank" class="btn" style="${asli ? '' : 'display:none;'}">Menuju Tautan Langsung</a>
                        <a href="https://arsiparis-web.vercel.app/" target="_blank" class="btn">Arsipkan Web (G Drive)</a>
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
