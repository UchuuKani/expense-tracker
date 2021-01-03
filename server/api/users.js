const router = require("express").Router();
const client = require("../db");
const extendedQueries = require("../queries");
const {
  tagParser,
  insertTagQueryGenerator,
  convertDollarsToCents,
} = require("../../utils");

router.get("/", async (req, res, next) => {
  try {
    const query = extendedQueries.getAllUsers;
    const { rows } = await client.query(query);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

//gets a user and all of their transactions
// this could potentially be separated into route that only provides user data
// and then /api/transactions/:userId
// instead of getting user info + their transactions all in one route
// especially if front end does not display user data and their transaction data in the same page (currently they are together, but could change)
router.get("/:id", async (req, res, next) => {
  try {
    const userWithTransactions = await client.query(
      extendedQueries.userWithTransactionsNoTags,
      [req.params.id]
    );
    console.log(userWithTransactions.rows[0]);
    if (!userWithTransactions.rows.length) {
      const new404 = new Error("User not found");
      new404.status = 404;
      throw new404;
    }
    const userData = userWithTransactions.rows[0];
    // with current query userWithTransactions, if user has no transactions the transactions field is null - so we set the transactions
    // property as an empty array if they don't have any transactions for easier logic on front end render
    if (userData.transactions === null) {
      userData.transactions = [];
    }
    // ultimately, want a query that returns all of a users unique transactions, with each transaction object including an array of all
    // tag objects associated with it {...userStuffGeneratedInFirstQuery, transactions: Transactions[]} where each transaction looks
    // like {id: number, description: string, amount: number, transaction_date: string, tags: Tag[]} and each Tag looks like
    // {id: number, tag_name: string}

    res.send(userData); // send userWithTransactions
  } catch (err) {
    next(err);
  }
});

router.get("/:id/transactions/:transactionId", async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { getSingleTransactionWithTags } = extendedQueries;

    const foundTransactionWithTags = await client.query(
      getSingleTransactionWithTags,
      [transactionId]
    );

    const transactionData = foundTransactionWithTags.rows[0].full_transaction;
    console.log("transaction data", transactionData);
    res.send(transactionData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//posts a new user to the database
router.post("/", async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const query = extendedQueries.postNewUser;

    const { rows } = await client.query(query, [name, email]);

    res.status(201).send(rows[0]);
  } catch (err) {
    next(err);
  }
});

// posts a new transcation for a specific user, and includes tags - does not currently allow for posting a date
// TODO: probably want to add some validation either on backend or frontend at some point
router.post("/:userId", async (req, res, next) => {
  try {
    let { description, amount, date, tags } = req.body; // by default, db sets date for new transaction by calling NOW()::DATE (timestamp casted to date)
    // but want to allow a user to pick a date for a transaction as well when posting a new one
    // likely scenario: include a date picker in front end that defaults to current day, and always send its value in body of request - insert the date
    // into db. Current query for inserting new transaction (postNewUserTransaction) doesn't have field for inserting date, but this can be changed
    // easily enough

    // request body comes in as {description: string, amount: string, tags: string, date: string}
    // amount needs to be parsed into a number and then multiplied by 100 to convert from dollars to cents
    // tags comes in as a string and should be processed into an array of type string, string[] - this will be done by the tagParser utility function

    // have to process tags to insert into table, assuming it is a comma separated string
    // tagParser(tags: string): string[]
    const processedTags = tagParser(tags);

    const { postNewUserTransaction, insertOrDoNothingTag } = extendedQueries;

    // validate the date coming from form submission before trying to query db with it
    // 12/30/2020 - for now, using this SO post: https://stackoverflow.com/questions/42876071/how-to-save-js-date-now-in-postgresql to create new date
    // if req.body.date is an empty string
    // ideally, would check to make sure date is defined, and then run additional validation in the "if" block
    if (!date) {
      // if date is an empty string
      date = new Date().toISOString();
    }
    console.log("we got a date here...", date);
    // post transaction to transactions table
    // rows is an array that contains a single object with transaction's id, user_id, description, amount, and transaction_date
    const { rows } = await client.query(postNewUserTransaction, [
      description,
      convertDollarsToCents(amount),
      req.params.userId,
      date,
    ]);

    let [transactionResponse] = rows; // equivalent to accessing rows[0] and saving to a variable

    let transactionId = transactionResponse.id;

    // try to create every tag in the list in the database
    // output is an array of the length of tags - current query does not work as expected - tags seem to be posted but no
    // return values

    const queryTags = processedTags.map((tag) => {
      return client.query(insertOrDoNothingTag, [tag]);
    });

    const insertTagsArr = await Promise.all(queryTags);

    const idArray = insertTagsArr.map((res) => {
      return res.rows[0] ? res.rows[0].id : null;
    });

    // idArray will be a mixed array containing numbers and null values potentially
    // want to map position in idArray to existing tag value by matching on processedTags array
    // e.g. idArray might look like [43, 17, null] and processedTags might look like [groceries, food, alcohol] - in this case, it
    // would mean `groceries` and `food` are new tags being added for the first time, while `alcohol` already existed
    // want to find that null value (at index 2) is mapped to the existing tag `alcohol` and either:
    // find the `id` of the existing tag in the DB (alcohol) and swap out the null value in `idArray` OR
    // when trying to insert into join table below, update the function (did I mean to write query here?) to handle null values by looking up tags by name

    // first option - create map of (index in array, id in DB || null value) - for every null value, perform query to get tag_id
    // WHERE tag_name = processedTags[index], then create final array that has all tag_ids and use that array in below query

    for (let i = 0; i < idArray.length; i++) {
      // entry is a number representing the tag_id of a given tag in the db
      let entry = idArray[i];

      if (entry == null) {
        let existingTagName = processedTags[i];

        let foundTagId = await client.query(
          "SELECT tags.id FROM tags WHERE tag_name = $1",
          [existingTagName]
        );

        idArray[i] = foundTagId.rows[0].id;
      }
    }

    // create association in join table between created transaction and multiple tags from the insertTagsArr
    if (idArray.length > 0) {
      await client.query(
        insertTagQueryGenerator(transactionId, idArray.length),
        idArray
      );
    }
    console.log("and transaction response", transactionResponse);
    res.json(transactionResponse); //rewrite to send back newly created task or redirect to task list for user
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    // currently since I am display all user transactions on one page and don't have a separate page to view them, to delete, I
    // am only using the transactionId to determine which row should be deleted in transactions table, and which row(s) should be
    // deleted in the tags_transactions table

    const { transactionId } = req.body;

    // need to delete from tags_transactions join table first because it contains a foreign key from the transactions table
    // when I tried to delete from transactions table first, got an error saying a foreign key constraint was being violated
    const { deleteFromTagsTransactions, deleteTransaction } = extendedQueries;

    await client.query(deleteFromTagsTransactions, [transactionId]);

    await client.query(deleteTransaction, [transactionId]);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
