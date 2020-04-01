const ShoppingList = {
    getShoppingList(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertShoppingItem(knex, newShoppingItem) {
        return knex
            .insert(newShoppingItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
          return knex.from('shopping_list').select('*').where('id', id).first();
    },
    deleteShoppingItem(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
    },
    updateShoppingItem(knex, id, newItemFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newItemFields)
    },
}

module.exports = ShoppingList