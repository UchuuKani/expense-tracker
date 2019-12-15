const getAllUsers = "SELECT users.* FROM users";

const getUserIdTransactions = "SELECT row_to_json(t) AS user FROM \
  (SELECT id, name, email, \
  (SELECT json_agg(row_to_json(transactions)) \
    FROM transactions \
      WHERE user_id = users.id) AS user_transactions \
      FROM users \
        WHERE id = $1\
  ) t";

//do I just want to grab tags for specific transactionId, or grab the specific transaction along with all associated tags, and just pass down transaction info down from front end
const getSpecificTransaction = "SELECT id, description, amount, array_agg(t) AS tags FROM transactions LEFT JOIN tags USING (user_id) WHERE user_id = $1";

const postNewUser = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";

const postNewUserTransaction = "INSERT INTO transactions (description, amount, user_id) VALUES ($1, $2, $3) RETURNING *";

const postTagsOnTransaction = "";

module.exports = {
  getAllUsers,
  getUserIdTransactions,
  getSpecificTransaction, //is this needed? I'll try to write it anyway, even if this can just be shown on front-end (for practice)
  postNewUser,
  postNewUserTransaction, //not written
  postTagsOnTransaction //not written
}
