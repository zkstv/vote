require('dotenv').config();  // Carrega variáveis de ambiente
const fetch = require('node-fetch');

// Use variáveis de ambiente para dados sensíveis
const apiKey = process.env.OPENPOLL_API_KEY;
const spreadsheetId = process.env.SPREADSHEET_ID;
const sheetName = process.env.SHEET_NAME;
const apiURL = process.env.OPENPOLL_API_URL;

const options = {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
};

// Função assíncrona para criar uma nova enquete com tratamento de erro adequado
async function criarEnquete(titulo, candidatos) {
    const payload = {
        titulo,
        candidatos,
    };

    const requestOptions = {
        ...options,
        method: 'POST',
        body: JSON.stringify(payload),
    };

    try {
        const response = await fetch(`${apiURL}/enquete/criar`, requestOptions);
        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.statusText}`);
        }
        return await response.json();
    } catch (err) {
        console.error('Erro ao criar enquete:', err.message);
        throw err;
    }
}

module.exports = { criarEnquete };