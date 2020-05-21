const router = require("express").Router();
const client = require("../db");
const extendedQueries = require("../queries");
const { tagParser, insertTagQueryGenerator } = require("../../utils");

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
router.get("/:id", async (req, res, next) => {
  try {
    const userQuery = "SELECT users.* FROM users WHERE id = $1";

    const user = await client.query(userQuery, [req.params.id]);

    if (!user.rows.length) {
      const new404 = new Error("User not found");
      new404.status = 404;
      throw new404;
    }

    const userData = user.rows[0];

    // flaw with followUpUserId query is that if a transaction does not have tags associated with it in the join table, this query
    // will not find that transaction (maybe is null instead?)
    const query = extendedQueries.followUpUserId;

    const { rows } = await client.query(query, [req.params.id]);

    const userWithTransactions = { ...userData, transactions: rows };

    // this 404 check is in place for when I only make one query instead of two
    // if (!rows.length) {
    //   const new404 = new Error('User not found');
    //   new404.status = 404;
    //   throw new404;
    // }

    res.send(userWithTransactions);
  } catch (err) {
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
router.post("/:id", async (req, res, next) => {
  try {
    let { description, amount, date, tags } = req.body;
    // request body comes in as {description: string, amount: string, tags: string, date: string}
    // amount needs to be parsed into a number and then multiplied by 100 to convert from dollars to cents
    // tags comes in as a string and should be processed into an array of type string, string[] - this will be done by the tagParser utility function

    // have to process tags to insert into table, assuming it is a comma separated string
    // tagParser(tags: string): string[]
    const processedTags = tagParser(tags);

    const { postNewUserTransaction, insertOrDoNothingTag } = extendedQueries;

    // post transaction to transactions table
    // rows is an array that contains a single object with transaction's id, user_id, description, amount, and transaction_date
    const { rows } = await client.query(postNewUserTransaction, [
      description,
      parseInt(amount),
      req.params.id,
    ]);

    let [transactionResponse] = rows;
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
    // want to find that null (index 3) is mapped to the existing tag `alcohol` (index 3) and either:
    // find the `id` of the existing tag in the DB (alcohol) and swap out the null value in `idArray` OR
    // when trying to insert into join table below, update the function to handle null values by looking up tags by name

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
