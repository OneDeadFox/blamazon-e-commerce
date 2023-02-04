const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const categoryData = await Category.findAll({
      include:[Product]
    });
    res.json(categoryData);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg:"an error has occured on our end.",
      err:err
    })
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categoryDatum = await Category.findByPk(req.params.id, {
      include:[Product]
    });
    res.json(categoryDatum);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg:"an error has occured on our end.",
      err:err
    })
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create({
      category_name:req.body.category_name,
    });
    res.status(201).json(newCategory);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg:"an error has occured on our end.",
      err:err
    })
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const updateCategory = await Category.update({
      category_name:req.body.category_name,
    },{
      where:{
        id:req.params.id
      }
    })
    if(updateCategory[0]){
      return res.json(updateCategory)
    } else {
      return res.status(404).json({
        msg:"There is no category matching that id."
      })
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({
      mgs:"an error has occured on our end.",
      err:err
    })
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const deleteCategory = await Category.destroy({
      where:{
        id:req.params.id
      }
    });
    if(deleteCategory) {
      return res.json(deleteCategory)
    } else {
      return res.status(404).json({
        msg:"There is no category matching that id."
      })
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({
      mgs:"an error has occured on our end.",
      err:err
    })
  }
});

module.exports = router;
