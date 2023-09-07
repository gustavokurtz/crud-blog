const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const port = 8080;

// Configurar o mecanismo de modelo Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware para analisar o corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware para entrar na pasta public
app.use(express.static('public'));



// Banco de dados em forma de array para armazenar os dados
const database = [];

// Rota principal para exibir a lista de itens
app.get('/', (req, res) => {
  res.render('home', { items: database });
});

app.post('/create', (req, res) => {
  const newItem = req.body.item;

  // Verifique se o novo item tem 30 caracteres ou menos
  if (newItem.length > 30) {
    return res.send('<script>alert("O seu comentário deve ter no máximo 30 caracteres."); window.history.back();</script>');
  }

  // Verifique se o limite de comentários por publicação foi atingido
  if (database.length >= 2 ) {
    return res.send('<script>alert("Você atingiu o limite de comentários por publicação."); window.history.back();</script>');
  }

  database.push(newItem);
  res.redirect('/');
});

// Rota para excluir um item
app.get('/delete/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0) {
    database.splice(index, 1);
  }
  res.redirect('/');
});

// Rota para exibir o formulário de edição de um item
app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0) {
      const item = database[index];
      res.render('edit', { index, item, items: database }); // Passamos também a lista de itens para a página de edição
    } else {
      res.redirect('/');
    }
  });
  
  
// Rota para atualizar um item
app.post('/update/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 ) {
      const updatedItem = req.body.updatedItem;
      database[index] = updatedItem;
    }
    res.redirect('/');
});

app.get('/construcao', (req, res) => {
  res.render('construcao')
})
  

// Inicie o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
