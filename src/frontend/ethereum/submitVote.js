const Web3 = require('web3');
const Joi = require('joi');
require('dotenv').config();  // Carrega variáveis de ambiente de um arquivo .env para process.env
const contractABI = require('./STVPollABI.json');  // ABI do contrato STVPoll

// Use variáveis de ambiente para dados sensíveis
const contractAddress = process.env.CONTRACT_ADDRESS;  // Endereço do contrato STVPoll implantado
const web3 = new Web3(process.env.INFURA_PROJECT_URL);  // Conexão com a Mainnet da Ethereum

// Função de envio de votos encapsulada com validação de entrada
async function submitVote(voterAddress, voteProof, preferences) {
    // Definição do esquema de validação usando Joi
    const schema = Joi.object({
        proof: Joi.object({
            a: Joi.string().required(),
            b: Joi.string().required(),
            c: Joi.string().required(),
            input: Joi.array().items(Joi.string()).required()
        }).required(),
        preferences: Joi.array().items(Joi.number()).required()
    });

    // Validação dos dados de entrada
    const { error } = schema.validate({ proof: voteProof, preferences });
    if (error) {
        throw new Error(`Invalid input data: ${error.details[0].message}`);
    }

    try {
        // Inicializa o contrato com o ABI e o endereço do contrato
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Estima o gás necessário para a transação
        const gasEstimate = await contract.methods.submitVote(voteProof, preferences).estimateGas({ from: voterAddress });

        // Envia a transação
        const tx = await contract.methods.submitVote(voteProof, preferences).send({ from: voterAddress, gas: gasEstimate });
        
        // Retorna a transação com sucesso
        return tx;
    } catch (err) {
        // Tratamento de erro para falha no envio do voto
        throw new Error(`Failed to submit vote: ${err.message}`);
    }
}

module.exports = { submitVote };