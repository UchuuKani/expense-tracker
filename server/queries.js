const getAllUsers = 'SELECT users.* FROM users';

//do another subquery within query starting on line 8 to grab all tags associated with a transaction
//something like ...FROM transactions JOIN (SELECT json_agg(row_to_json(table_alias)))

const getUserIdTransactions =
  'SELECT t.* FROM \
  (SELECT id, name, email, \
  (SELECT json_agg(row_to_json(transactions)) \
    FROM transactions \
      WHERE user_id = users.id) AS user_transactions \
      FROM users \
        WHERE id = $1\
  ) t';

//do I just want to grab tags for specific transactionId, or grab the specific transaction along with all associated tags, and just pass down transaction info down from front end -- my answer is grab the user and all (or some) transactions with transactions joined to tags
const getSpecificTransaction =
  'SELECT id, description, amount, array_agg(t) AS tags FROM transactions LEFT JOIN tags USING (user_id) WHERE user_id = $1';

const postNewUser =
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';

const postNewUserTransaction =
  'INSERT INTO transactions (description, amount, user_id) VALUES ($1, $2, $3) RETURNING *';

// select users.*, json_agg(f) from (select row_to_json(t) AS transactions from
// (select * from transactions where user_id = users.id) t) f
// join users
// on users.id = transactions.id
// where users.id = 1;

const postTagsOnTransaction =
  'SELECT t.* AS user FROM \
  (SELECT id, name, email, \
  (SELECT json_agg(row_to_json(transactions)) \
    FROM transactions \
      WHERE user_id = users.id) AS user_transactions \
      FROM users \
        WHERE id = 1\
  ) t';

// this query selects a single transaction with id = 2, as well as all the tag_ids associated with that transaction from the tags_transactions table

// -- join transactons to tags_transactions
// -- join resulting table of "transactions to tags_transactions"
// -- to tags

const kindOfWorks =
  'select transactions.*, tags_transactions.* from \
transactions JOIN tags_transactions \
on transactions.id = tags_transactions.transaction_id \
where transactions.id = 2';

const alsoWorksSortOf =
  'SELECT transactions.*, \
tags.* \
from transactions \
join tags_transactions \
on transactions.id = tags_transactions.transaction_id \
join tags on tags.id = tags_transactions.tag_id \
where transactions.id = 2';

module.exports = {
  getAllUsers,
  getUserIdTransactions,
  getSpecificTransaction, //is this needed? I'll try to write it anyway, even if this can just be shown on front-end (for practice)
  postNewUser,
  postNewUserTransaction, //not written
  postTagsOnTransaction, //not written
};
