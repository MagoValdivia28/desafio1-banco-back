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
    const { material, comprimento, nucleo, data_criacao } = req.body;

    if (!material || !comprimento || !nucleo || !data_criacao) {
        res.status(400).json({ error: "Todos os campos são obrigatórios" });
        return;
    }
    try {
        const resultado = await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, data_criacao) VALUES ($1, $2, $3, $4) RETURNING *', [material, comprimento, nucleo, data_criacao]);

        if (resultado.rowCount === 0) {
            res.status(500).json({ error: "Erro ao inserir os dados" });
            return;
        }
        res.status(201).json({ message: "Varinha inserida com sucesso"})
    } catch (error) {
        console.error("Erro ao inserir varinha:", error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
//ATUALIZAR VARINHA
app.put('/varinhas/:id', async (req, res) => {
    const { id } = req.params;
    const { material, comprimento, nucleo, data_criacao } = req.body;
    try {
        const resultado = await pool.query('UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_criacao = $4 WHERE id = $5 RETURNING *', [material, comprimento, nucleo, data_criacao, id]);
        res.json({ message: 'Varinha atualizada com sucesso' });
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
    const { nome, idade, casa, habilidade, sangue, patrono } = req.body;
    try {
        if (sangue == 'puro' || sangue == 'mestiço' || sangue == 'trouxa') {
            const resultado = await pool.query('INSERT INTO bruxos (nome, idade, casa, habilidade, sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nome, idade, casa, habilidade, sangue, patrono]);
            res.json(resultado.rows[0]);
        } else {
            res.status(400).json({ error: 'Tipo de sangue inválido para bruxo' });
        }
    } catch (error) {
        console.error("Erro ao inserir bruxo", error);
        res.status(500).json({ error: 'Erro ao inserir bruxo' });
    }
});

//ATUALIZAR BRUXO
app.put('/bruxos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, casa, habilidade, sangue, patrono } = req.body;
    try {
        const resultado = await pool.query('UPDATE bruxos SET nome = $1, idade = $2, casa = $3, habilidade = $4, sangue = $5, patrono = $6 WHERE id = $7 RETURNING *', [nome, idade, casa, habilidade, sangue, patrono, id]);
        res.json({ message: 'Bruxo atualizado com sucesso'});
    } catch (error) {
        console.error("erro ao atualizar usuarios", error);
        res.status(500).json({ error: 'erro ao atualizar usuarios' });
    }
});

//DELETAR BRUXO
app.delete('/bruxos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM bruxos WHERE id = $1', [id]);
        res.json({ message: 'Bruxo deletado com sucesso' });
    } catch (error) {
        console.error("erro ao deletar usuarios", error);
        res.status(500).json({ error: 'erro ao deletar usuarios' });
    }
});

//PEGAR BRUXO PELO NOME
app.get('/bruxos/nome/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM bruxos WHERE nome = $1', [nome]);
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




app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
    res.send('a rota esta funcionando');
});	
