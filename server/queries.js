const getAllUsers = 'SELECT users.* FROM users';

//do another subquery within query starting on line 8 to grab all tags associated with a transaction
//something like ...FROM transactions JOIN (SELECT json_agg(row_to_json(table_alias)))

const getUserIdTransactions = //WIP to query single user, all their transactions, and all tags for all their transactions
  'SELECT t.* FROM \
    (SELECT id, name, email, \
    (SELECT json_agg(row_to_json(transactions)) \
      FROM transactions \
        WHERE user_id = users.id) AS user_transactions \
        FROM users \
          WHERE id = $1\
    ) t';

const followUpUserId =
  'SELECT transactions.*, json_agg(tags.*) as tags \
   FROM \
    transactions \
    JOIN \
    tags_transactions \
    ON \
    transactions.id = tags_transactions.transaction_id \
    JOIN \
    tags \
    ON \
    tags_transactions.tag_id = tags.id \
    WHERE transactions.user_id = $1 \
    GROUP BY transactions.id';

//do I just want to grab tags for specific transactionId, or grab the specific transaction along with all associated tags, and just pass down transaction info down from front end -- my answer is grab the user and all (or some) transactions with transactions joined to tags

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
  (SELECT json_agg(row_to_json(row(g))) \
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
  'SELECT json_agg(t) FROM (SELECT transactions.*, \
tags.* \
from transactions \
join tags_transactions \
on transactions.id = tags_transactions.transaction_id \
join tags on tags.id = tags_transactions.tag_id \
where transactions.id = 2) t';

module.exports = {
  getAllUsers,
  getUserIdTransactions,
  followUpUserId,
  postNewUser,
  postNewUserTransaction, //not written
  postTagsOnTransaction, //not written,
  alsoWorksSortOf,
};
