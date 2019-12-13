const getAllUsers = "SELECT users.* FROM users";

const getUserIdTransactions = "SELECT row_to_json(t) AS user FROM \
  (SELECT id, name, email, \
  (SELECT json_agg(row_to_json(transactions)) \
    FROM transactions \
      WHERE user_id = users.id) AS user_transactions \
      FROM users \
        WHERE id = $1\
  ) t";

const getSpecificTransaction = "";

const postNewUser = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";

const postNewUserTransaction = "INSERT INTO transactions (description, amount, user_id) VALUES ($1, $2, $3) RETURNING *";

module.exports = {
  getAllUsers,
  getUserIdTransactions,
  getSpecificTransaction, //is this needed?
  postNewUser,
  postNewUserTransaction //not written
}
