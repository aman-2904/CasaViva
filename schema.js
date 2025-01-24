const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi
        .object({
          url: joi
            .string()
            .uri()
            .allow("")
            .default(
              "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg"
            ),
          filename: joi.string().allow("").default("default.jpg"),
        })
        .default({
          url: "https://media.cntraveler.com/photos/53da60a46dec627b149e66f4/master/w_1600%2Cc_limit/hilton-moorea-lagoon-resort-spa-moorea-french-poly--110160-1.jpg",
          filename: "default.jpg",
        }),
      location: joi.string().required(),
      country: joi.string().required(),
      category: joi.string().required(),
    })
    .required(),
});

module.exports.reviewSchema = joi
  .object({
    review: joi.object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    }),
  })
  .required();
