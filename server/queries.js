/* eslint-disable no-multi-str */

// gets all of a user's info - used as one query in GET /api/users/:id to grab only user info
const getAllUsers = "SELECT users.* FROM users";

// gets a single user's info
const userQuery = "SELECT users.* FROM users WHERE id = $1";

// gets all of a user's transactions in GET /api/users/:id route - result is added onto getAllUsers query above
const allTransactions =
  "SELECT id, user_id, description, amount, transaction_date FROM transactions WHERE user_id = $1 ORDER BY transactions.transaction_date DESC";

// gets all of a user's transactions and loads all tag rows (1 null row for every transaction with no tags) - does not convert to json
const _DEPRECATED_allTransactionsWithTagsAsRows =
  "select * from transactions left join tags_transactions tg on (transactions.id = tg.transaction_id) left join tags g on (tg.tag_id = g.id) where transactions.user_id = $1";

// same as allTransactionsWithTagsAsRows query, except loads all tags onto each transaction as an array
// if a user has no transactions, then this query returns nothing/undefined in Node console
const allTransactionsWithTagsArray =
  "SELECT transactions.*, json_agg(g.tag_name) AS tags \
    FROM transactions \
    LEFT JOIN tags_transactions tg \
    ON (transactions.id = tg.transaction_id) \
    LEFT JOIN tags g \
    ON (tg.tag_id = g.id) \
    WHERE transactions.user_id = $1 \
    GROUP BY transactions.id \
    ORDER BY transactions.transaction_date DESC";

const userWithTransactionsNoTags =
  "SELECT id, name, email, (SELECT JSON_AGG(ts) FROM \
  (SELECT * FROM transactions WHERE user_id = $1 ORDER BY transactions.transaction_date DESC) ts) AS transactions FROM users WHERE id = $1;";

const getSingleTransactionWithTags =
  "SELECT ROW_TO_JSon(whole_transaction) AS full_transaction \
  FROM (SELECT description, amount, transaction_date, (SELECT JSon_AGG(tgs) FROM (SELECT * FROM tags_transactions  JOIN tags \
  ON tags_transactions.tag_id = tags.id \
    where tags_transactions.transaction_id = $1 \
    ) tgs \
  ) AS tags \
FROM transactions WHERE transactions.id = $1) whole_transaction";

// this won't return an id when the on ConFLICT clause fires, instead will get null?
const insertOrDoNothingTag =
  "INSERT INTO tags (tag_name) VALUES ($1) \
on ConFLICT (tag_name) DO NOTHING \
RETURNING id";

// create the association between a transaction and a single tag - would call this multiple times for every added for a transaction
// insert the transaction_id as first query param, and tag_id as second query param
const insertTagOnTransaction =
  "INSERT INTO tags_transactions (transaction_id, tag_id)\
  VALUES ($1, $2)";

const _DEPRECATED_getUserIdTransactions = //WIP to query single user, all their transactions, and all tags for all their transactions
  // 5/30/2020 - no longer using query, only keeping for reference
  "SELECT t.* FROM \
    (SELECT id, name, email, \
    (SELECT JSon_AGG(row_to_json(transactions)) \
      FROM transactions \
        WHERE user_id = users.id) AS user_transactions \
        FROM users \
          WHERE id = $1\
    ) t";

// flaw here is that if a transaction does not have tags associated with it in the JOIN table, this query will not find that
// transaction
const _DEPRECATED_followUpUserId = // 5/30/2020 - no longer using query, only keeping for reference - maybe revisit to use?
  "SELECT transactions.*, JSon_AGG(tags.*) as tags \
   FROM \
    transactions \
    JOIN \
    tags_transactions \
    on \
    transactions.id = tags_transactions.transaction_id \
    JOIN \
    tags \
    on \
    tags_transactions.tag_id = tags.id \
    WHERE transactions.user_id = $1 \
    GROUP BY transactions.id \
    ORDER BY transactions.transaction_date DESC";

//do I just want to grab tags for specific transactionId, or grab the specific transaction along with all associated tags, and just pass down transaction info down FROM front end -- my answer is grab the user and all (or some) transactions with transactions JOINed to tags

const postNewUser =
  "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";

const postNewUserTransaction =
  "INSERT INTO transactions (description, amount, user_id) VALUES ($1, $2, $3) RETURNING *";

// SELECT users.*, JSon_AGG(f) FROM (SELECT row_to_json(t) AS transactions FROM
// (SELECT * FROM transactions where user_id = users.id) t) f
// JOIN users
// on users.id = transactions.id
// where users.id = 1;

// this query SELECTs a single transaction with id = 2, as well as all the tag_ids associated with that transaction FROM the tags_transactions table

// -- JOIN transactons to tags_transactions
// -- JOIN resulting table of "transactions to tags_transactions"
// -- to tags

const kindOfWorks =
  "SELECT transactions.*, tags_transactions.* FROM \
transactions JOIN tags_transactions \
on transactions.id = tags_transactions.transaction_id \
where transactions.id = 2";

const alsoWorksSortOf =
  "SELECT JSon_AGG(t) FROM (SELECT transactions.*, \
tags.* \
FROM transactions \
JOIN tags_transactions \
on transactions.id = tags_transactions.transaction_id \
JOIN tags on tags.id = tags_transactions.tag_id \
where transactions.id = 2) t";

const deleteFromTagsTransactions =
  "DELETE FROM tags_transactions WHERE tags_transactions.transaction_id = $1";

const deleteTransaction = "DELETE FROM transactions WHERE transactions.id = $1";

module.exports = {
  getAllUsers,
  userQuery,
  postNewUser,
  postNewUserTransaction,
  alsoWorksSortOf,
  insertOrDoNothingTag,
  insertTagOnTransaction,
  kindOfWorks,
  deleteFromTagsTransactions,
  deleteTransaction,
  getSingleTransactionWithTags,
  allTransactions,
  userWithTransactionsNoTags,
  allTransactionsWithTagsArray,
};
