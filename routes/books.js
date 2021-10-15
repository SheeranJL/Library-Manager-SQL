const Book = require('../models').Book;
const Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
const Op = Sequelize.Op

//asyncHandler function

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      res.status(500).send(error)
    }
  }
};

/* Shows all books. */
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {books} )
}));


//Shows Create New Book page //
router.get('/new', (req, res) => {
  res.render('new-book', {title: 'Enter a new Book'});
});


router.post('/new', asyncHandler(async (req, res) => {
  let newEntry;
  try {
    //new instance//
      newEntry = await Book.create(req.body);
      res.redirect('/');

    } catch(error) {
      if (error.name === "SequelizeValidationError") {
        newEntry = await Book.build(req.body);
        res.render('form-error', {})

      }
    }
  }
));

//Shows book detail form//
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
  res.render('book-detail', {book} );
  } else {
  console.log('A 500 error occured.')
  res.render('error', {message: 'There was an issue on our end providing you with the information you requested. Please let us know if you believe this to be a mistake.'});
  }
}
));

//Edit Page//
router.get('/:id/edit', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  res.render('update-book', {book} )
}));


//Updates book info in database//
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book = await Book.findByPk(req.params.id);
  if (book) {
    try {
      console.log(req.body)
      book = await book.update(req.body) //here we're updating the book with the key/value pairs from the req.body object
      res.redirect('/')
    } catch (error) {
      console.log('test', error)
    }
  }

}))


//Deletes a book from database//
router.post('/:id/delete', asyncHandler(async (req, res) => {
  let book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/')
}));


router.post('/search', asyncHandler(async (req, res) => {
  const searchQuery = req.body.search.toLowerCase();

  const books = await Book.findAll({
    where: {
      [Op.or]: [ // Same as 'Select (all headings), FROM Books where (Title OR Author OR Genre...) LIKE (search query)'
              { Title: {[Op.like]: `%${searchQuery}%` }},
              { Author: {[Op.like]: `%${searchQuery}%` }},
              { Genre: {[Op.like]: `%${searchQuery}%` }},
              { Year: {[Op.like]: `%${searchQuery}%`}}
              ]
            }
  })
  res.render('index', {books:books})
  }))

module.exports = router;
