const Pool = require('pg').Pool
const pool = new Pool({
    user: "uojyssgxeojarp",
    host: "ec2-23-20-224-166.compute-1.amazonaws.com",
    database: "d4ahtk0vtsf17a",
    password: "5ff488f69681ea28e682bd6e499c8b67c803493fee3f05a5ea746ef44a00d545",
    port: 5432,
    ssl: { rejectUnauthorized: false }
})

//require('dotenv').config()

const getUsers = (request, response) => {
  pool.query('SELECT * FROM usuario ORDER BY id_user ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM usuario WHERE id_user = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { nome, id_user, tipo_pessoa, cpf_cnpj, portfolio, id_servico, rua, numero, bairro, cidade, estado, cep, login } = request.body

  pool.query('INSERT INTO usuario (nome, id_user, tipo_pessoa, cpf_cnpj, portfolio, id_servico, rua, numero, bairro, cidade, estado, cep, login) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [ nome, id_user, tipo_pessoa, cpf_cnpj, portfolio, id_servico, rua, numero, bairro, cidade, estado, cep, login], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
    	throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id_user}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const {  nome, id_user, tipo_pessoa, cpf_cnpj, portfolio, id_servico, rua, numero, bairro, cidade, estado, cep, login } = request.body

  pool.query(
    'UPDATE usuario SET nome = $1, id_user = $2, tipo_pessoa = $3, cpf_cnpj = $4, portfolio = $5, id_servico = $6, rua = $7, numero = $8, bairro = $9, cidade = $10, estado = $11, cep = $12, login = $13 WHERE id_user = $2 RETURNING *',
    [ nome, id_user, tipo_pessoa, cpf_cnpj, portfolio, id_servico, rua, numero, bairro, cidade, estado, cep, login],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
      	response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
      	response.status(404).send(`User not found`);
      } else {
  	 	  response.status(200).send(`User modified with ID: ${results.rows[0].id_user}`)         	
      }
      
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM usuario WHERE id_user = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
