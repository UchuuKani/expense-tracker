-- DROP TABLE IF EXISTS upvotes;
DROP TABLE IF EXISTS users, transactions, tags, tags_transactions;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  description varchar(255) DEFAULT NULL,
  amount INTEGER NOT NULL,
  transaction_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tags_transactions (
  tags_transactions_id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) NOT NULL,
  tag_id INTEGER REFERENCES tags(id) NOT NULL
);

-- users
INSERT INTO users (name, email) VALUES ('Alex', 'alex@email.com');
INSERT INTO users (name, email) VALUES ('Nataly', 'nataly@email.com');
INSERT INTO users (name, email) VALUES ('Hetty', 'hetty1336@example.com');
INSERT INTO users (name, email) VALUES ('Alphard', 'apha@example.com');
INSERT INTO users (name, email) VALUES ('Notransactions', 'none@example.com');


-- transactions
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Alex'), 'Just some chips', 150);
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Nataly'), 'The Switch', 35000);
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Alex'), 'Japan Village snacks', 2000);
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Hetty'), 'Garlic, onions and eye of newt', 1200);
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Nataly'), 'Empanada ingredients', 1500);
INSERT INTO transactions (user_id, description, amount) VALUES ((SELECT id FROM users WHERE name = 'Alphard'), 'Big old TV', 10000000);

-- tags
INSERT INTO tags (tag_name) VALUES ('food');
INSERT INTO tags (tag_name) VALUES ('gaming');
INSERT INTO tags (tag_name) VALUES ('technology');
INSERT INTO tags (tag_name) VALUES ('groceries');
INSERT INTO tags (tag_name) VALUES ('entertainment');

-- tags_transactions
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Just some chips'), (SELECT id FROM tags WHERE tag_name = 'food'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'The Switch'), (SELECT id FROM tags WHERE tag_name = 'gaming'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'The Switch'), (SELECT id FROM tags WHERE tag_name = 'entertainment'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Japan Village snacks'), (SELECT id FROM tags WHERE tag_name = 'groceries'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Garlic, onions and eye of newt'), (SELECT id FROM tags WHERE tag_name = 'groceries'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Empanada ingredients'), (SELECT id FROM tags WHERE tag_name = 'food'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Empanada ingredients'), (SELECT id FROM tags WHERE tag_name = 'groceries'));
INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ((SELECT id FROM transactions WHERE description = 'Big old TV'), (SELECT id FROM tags WHERE tag_name = 'entertainment'));

