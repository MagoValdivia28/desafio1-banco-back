const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database:"harrypotter",
    password: 'ds564',
    port: 7007,
});

app.use(express.json());

//PEGAR TODAS AS VARINHAS
app.get('/varinhas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM varinhas');
        res.json({ 
            total: resultado.rowCount,
            varinhas: resultado.rows,
         });
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});

//PEGAR VARINHA POR ID
app.get('/varinhas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});

//ADICIONAR VARINHA
app.post('/varinhas', async (req, res) => {
    const { material, comprimento, nucleo, data_fabricacao } = req.body;
    try {
        const resultado = await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4) RETURNING *', [material, comprimento, nucleo, data_fabricacao]);
        if(resultado.rowCount == 0){
            res.status(404).send("Usuário não encontrado");
            return;
        }else{
            res.json(resultado.rows[0]);
        };
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});

//ATUALIZAR VARINHA
app.put('/varinhas/:id', async (req, res) => {
    const { id } = req.params;
    const { material, comprimento, nucleo, data_fabricacao } = req.body;
    try {
        const resultado = await pool.query('UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5 RETURNING *', [material, comprimento, nucleo, data_fabricacao, id]);
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("erro ao atualizar usuarios", error);
        res.status(500).json({ error: 'erro ao atualizar usuarios' });
    }
});

//DELETAR VARINHA
app.delete('/varinhas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM varinhas WHERE id = $1', [id]);
        res.json({ message: 'Varinha deletada com sucesso' });
    } catch (error) {
        console.error("erro ao deletar usuarios", error);
        res.status(500).json({ error: 'erro ao deletar usuarios' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
    res.send('a rota esta funcionando');
});	





//PEGAR TODOS OS BRUXOS
app.get('/bruxos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM bruxos');
        res.json({ 
            total: resultado.rowCount,
            bruxos: resultado.rows,
         });
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});

//PEGAR BRUXO POR ID
app.get('/bruxos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
        if(resultado.rowCount == 0){
            res.status(404).send("Usuário não encontrado");
            return;
        }else{
            res.json(resultado.rows[0]);
        };
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});

//ADICIONAR BRUXO
app.post('/bruxos', async (req, res) => {
    const { nome, idade, casa, habilidades, sangue, patrono } = req.body;
    try {
        const resultado = await pool.query('INSERT INTO bruxos (nome, idade, casa, habilidades, sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nome, idade, casa, habilidades, sangue, patrono]);
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("erro ao obter usuarios", error);
        res.status(500).json({ error: 'erro ao obter usuarios' });
    }
});



