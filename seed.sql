-- DROP TABLE IF EXISTS upvotes;
DROP TABLE IF EXISTS users, transactions, tags, tags_transactions;

CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
  name TEXT DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL
);

CREATE TABLE transactions (
  transactionId SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(userId) NOT NULL,
  description varchar(255) DEFAULT NULL,
  amount INTEGER NOT NULL
);

CREATE TABLE tags (
  tagId SERIAL PRIMARY KEY,
  tagName VARCHAR(255) NOT NULL
);

CREATE TABLE tags_transactions (
  transactionId INTEGER REFERENCES transactions(transactionId) NOT NULL,
  tagId INTEGER REFERENCES tags(tagId) NOT NULL
);

-- users
INSERT INTO users (name, email) VALUES ('Alex', 'alex@email.com');
INSERT INTO users (name, email) VALUES ('Nataly', 'nataly@email.com');
INSERT INTO users (name, email) VALUES ('Hetty', 'hetty1336@example.com');
INSERT INTO users (name, email) VALUES ('Alphard', 'apha@example.com');

-- transactions
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Alex'), 'Just some chips', 150);
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Nataly'), 'The Switch', 35000);
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Alex'), 'Japan Village snacks', 2000);
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Hetty'), 'Garlic, onions and eye of newt', 1200);
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Nataly'), 'Empanada ingredients', 1500);
INSERT INTO transactions (userId, description, amount) VALUES ((SELECT userId FROM users WHERE name = 'Alphard'), 'Big old TV', 10000000);

-- tags
INSERT INTO tags (tagName) VALUES ('food');
INSERT INTO tags (tagName) VALUES ('gaming');
INSERT INTO tags (tagName) VALUES ('technology');
INSERT INTO tags (tagName) VALUES ('groceries');
INSERT INTO tags (tagName) VALUES ('entertainment');

-- tags_transactions
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Just some chips'), (SELECT tagId FROM tags WHERE tagName = 'food'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'The Switch'), (SELECT tagId FROM tags WHERE tagName = 'gaming'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'The Switch'), (SELECT tagId FROM tags WHERE tagName = 'entertainment'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Japan Village snacks'), (SELECT tagId FROM tags WHERE tagName = 'groceries'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Garlic, onions and eye of newt'), (SELECT tagId FROM tags WHERE tagName = 'groceries'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Empanada ingredients'), (SELECT tagId FROM tags WHERE tagName = 'food'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Empanada ingredients'), (SELECT tagId FROM tags WHERE tagName = 'groceries'));
INSERT INTO tags_transactions (transactionId, tagId) VALUES ((SELECT transactionId FROM transactions WHERE description = 'Big old TV'), (SELECT tagId FROM tags WHERE tagName = 'entertainment'));

