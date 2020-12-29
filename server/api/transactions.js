const router = require("express").Router();

const client = require("../db");
const extendedQueries = require("../queries");
const { transactionsUpdateBuilder } = require("../../utils");

// gets a single transaction based on its transactionId
router.get("/:transactionId", async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { getSingleTransactionWithTags } = extendedQueries;
    console.log(transactionId);
    const foundTransactionWithTags = await client.query(
      getSingleTransactionWithTags,
      [transactionId]
    );

    // we get the full_transactions property off the db response as the "rows" field looks like row: [{full_transaction: {...data}}]
    const transactionData = foundTransactionWithTags.rows[0].full_transaction;

    res.send(transactionData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// add a new transaction for a user - feels weird/confusing to have the user's id be a query param, but maybe makes sense?
// POST /api/transactions:someId would make me think something related to a recipe is being posted, but in fact it would be the transaction itself
//
router.post("/:userId");

// should this route be to add a tag to an existing transaction? Should there just be a route for updating a transaction in its entirety, rather than just
// adding a tag?
// on front end, when a user adds a new tag, they'd ideally be interacting with a form that allows them to update the whole transaction including tags anyway
// would it be easier to separate logic that updates transaction's data as well as the join table between transactions and tags, or just update
// transaction data and tags-transactions join table data all in one go?
// feel like all in one go is the answer here, and probably don't need a route where we only post a new tag for a transaction
router.post("/:transactionId"); // is this even needed

// route for updating a transaction's info, and associated tags
router.patch("/:transactionId", async (req, res, next) => {
  // before passing req.body in, need to make sure that the "tags" property, if it exists on req.body, is not included as an updatable field in dbUpdateFilter
  const patchQuery = transactionsUpdateBuilder(req.body, {
    filter: "transactions.id",
  });
  const { transactionId } = req.params;
  console.log(
    "patchQuery as returned by dbUpdateFilter util function",
    patchQuery
  );
  // should maybe try to sanitize req.body before passing it into dbUpdateFilter / patchQuery
  if (!patchQuery) {
    // if patchQuery is falsey because one of two things happened, send a 400 error? MDN page below seems to say it should be a 400
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
    // should this just send some text back to client, or create an error and pass it to error-handling middleware to send a proper response? For now just sending
    // back text
    res.status(400).send("request body invalid");
  }
  // queryParamArray represents values being passed into sql query - first value is table name, last should be transactionId
  // middle values should be each value of request body in same order that they are passed into dbUpdateFilter
  // in this case, maybe better to use "arguments" object in implementation of dbUpdateFilter utility function?
  // have to wonder if the order of req.body's params will stay the same here as well as when req.body is passed as argument to dbUpdateFilter
  const queryParamArray = [];

  for (const val in req.body) {
    queryParamArray.push(req.body[val]);
  }
  queryParamArray.push(transactionId);
  console.log(
    "hopefully queryParamArray paramaterized argument order matches the order of fields listed in patchQuery/dbUpdateFilter",
    queryParamArray
  );
  let transactionResponseData;
  try {
    // if this query fails, should not have to do error checking below the try block since it will be caught by catch block
    // so further logic involving transactionResponseData outside of try/catch shouldn't need to check that transactionResponse is valid?
    // transactionResponseData = await client.query(
    //   patchQuery + " RETURNING *", // just added this RETURNING * to query because query builder does not add it, not even sure I want it
    //   queryParamArray
    // );
  } catch (err) {
    next(err);
  }

  // after updating transaction in "transactions" table, also need to update the tags_transactions join table in case any tags were added or removed
  // implement logic later

  if (transactionResponseData) {
    res.json(transactionResponseData);
  } else {
    res.send("heh faked u out");
  }
});

// delete a transaction based on its transactionId
// from front end, should have easy access to transactionIds for a user
router.delete("/:transactionId", async (req, res, next) => {
  const { deleteTransaction } = extendedQueries;
  try {
    await client.query(deleteTransaction, [req.params.transactionId]);
    res.sendStatus(202);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
