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

module.exports = { tagParser, insertTagQueryGenerator };
