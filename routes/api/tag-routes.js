const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tagData = await Tag.findAll({include: [Product]});
    res.json(tagData);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg: "An error occured on our end.",
      err:err
    });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tagDatum = await Tag.findByPk(req.params.id, {
      include: [Product]});
    res.json(tagDatum);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      msg: "An error occured on our end.",
      err:err
    });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: req.params.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(tag);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
    // update product data
    Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((tag) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { tag_id: req.params.id } });
      })
      .then((productTags) => {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ product_id }) => product_id);
        
        // create filtered list of new tag_ids
        const newProductTags = req.body.productIds
          .filter((productIds) => !productTagIds.includes(productIds))
          .map((productIds) => {
            return {
              tag_id: req.params.id,
              productIds,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ product_id }) => !req.body.productIds.includes(product_id))
          .map(({ id }) => id);
  
        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
