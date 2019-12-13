

const getUserIdTransactions = "SELECT row_to_json(t) AS user FROM \
  (SELECT id, name, email, \
  (SELECT json_agg(row_to_json(transactions)) \
    FROM transactions \
      WHERE user_id = users.id) AS user_transactions \
      FROM users \
        WHERE id = $1\
  ) t";

module.exports = {
  getUserIdTransactions
}
