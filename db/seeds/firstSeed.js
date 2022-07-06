/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
// allows us to use the faker library
const faker = require('faker');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('clucks')
    .del()
    .then(function () {
      const clucks = Array.from({length: 10}).map(() => {
        return {
          username: faker.name.findName(),
          content: faker.lorem.paragraph(),
          image_url: faker.image.imageUrl(),
          created_at: faker.date.past()
        }
      })
      return knex('clucks').insert(clucks)
    })
};
