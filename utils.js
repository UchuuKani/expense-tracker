//use to parse tag string into an array where all leading and trailing whitespace is removed and all alphabetical charactes are converted into lowercase
const tagParser = (tagStr) => {
  return tagStr
    .split(",")
    .filter((char) => {
      return char !== "" && char !== " ";
    })
    .map((char) => {
      return whitespaceRemover(char);
    });
};

const whitespaceRemover = (singleTag) => {
  let strToReturn = "";

  for (const char of singleTag) {
    if (char !== " ") {
      strToReturn += char.toLowerCase();
    }
  }

  return strToReturn;
};

// takes a transactionId and number of tags to associate with that transaction
// and generates an INSERT statement with n number of inserted rows with n number of query params ($1, $2, etc.)
// edge case: numTags argument == 0, then an invalid SQL statement would be returned
function insertTagQueryGenerator(transactionId, numTags) {
  // in case numTags === 0, return string with ; character as it does nothing in sql - will cause query to silently fail
  // since we don't want to create rows in the jon table anwayway, does it matter?
  if (numTags === 0) {
    console.log(
      "there were no tags on this transaction posting - numTags == 0 in this case"
    );
    return ";";
  }

  let insertStr =
    "INSERT INTO tags_transactions (transaction_id, tag_id) VALUES ";

  for (let i = 1; i <= numTags; i++) {
    insertStr += `(${transactionId}, $${i}), `;
  }
  // slicing from 0 to two characters before end of string because the last two chars generated will be ', '

  return insertStr.slice(0, -2);
}

const dupeFollowup =
  "SELECT transactions.*, json_agg(tags.*) as tags FROM transactions JOIN tags_transactions ON transactions.id = tags_transactions.transaction_id JOIN tags ON tags_transactions.tag_id = tags.id WHERE transactions.user_id = $1 GROUP BY transactions.id ORDER BY transactions.transaction_date DESC";

// function to build query for UPDATE actions in "transactions" table
// values can be a plain object where each key-value pair is the field that needs to be updated in the db row
// filterConfig is supposed to supply the WHERE clause info for the update query - this is not very robust at the moment
function transactionsUpdateBuilder(values, filterConfig = { filter: "" }) {
  // values should not be undefined, and it should be an object with at least one entry
  if (!values || Object.keys(values).length === 0) {
    return;
  }
  // build up the part of the query that sets each field to be updated, e.g. for values of {name: "steve", age: 57}
  // should get something resembling => name = "steve", age = 57
  let setStatement = "";
  let subParam = 1;
  const setVals = Object.keys(values);

  for (let key of setVals) {
    if (key !== "tags") {
      // req.body being passed in as the values object - it may include tags as a property to indicate which tags to add or remove
      // tags only pertains to tags_transactions table, so it should be ignored when constructing the query to update a row in "transactions"
      setStatement += `${key} = $${subParam}, `;
      subParam += 1;
    }
  }

  // remove trailing comma in setStatement after generating it
  setStatement = setStatement.slice(0, -2);

  return `UPDATE transactions SET ${setStatement} WHERE ${filterConfig.filter} = $${subParam};`;
}
console.log(
  transactionsUpdateBuilder(
    { description: "eater" },
    { filter: "transactions.id" }
  )
);
module.exports = {
  tagParser,
  insertTagQueryGenerator,
  transactionsUpdateBuilder,
};
