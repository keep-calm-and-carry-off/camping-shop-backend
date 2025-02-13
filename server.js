const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
require('dotenv').config();

const app = express();

// Эндпоинт для GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // Включает интерфейс GraphiQL для тестирования
}));

// Запуск сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));