const ShoppingList = require('../src/shopping-list-service')
const knex =  require('knex')

describe(`Shopping service object`, function() {
    let db 
    let testShoppingList = [
        {
            id: 1,
            name: 'First test item!',
            price: '2.50',
            category: 'Main',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
          },
          {
            id: 2,
            name: 'Second test item!',
            price: '3.50',
            category: 'Snack',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
          },
          {
            id: 3,
            name: 'Third test item!',
            price: '4.99',
            category: 'Lunch',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
          },
          {
            id: 4,
            name: 'Third test item!',
            price: '1.99',
            category: 'Breakfast',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
          },
    ]
    before(() => {
        db = knex({
            client: 'pg', 
            connection: process.env.TEST_DB_URL,
        })
    })

    

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Give getShoppingList() has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })
        it(`getShoppingList() resolves all items from 'shopping_list' table`, () => {
            return ShoppingList.getShoppingList(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList)
                })
        })
        it(`getById() resolves an article by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdShoppingItem = testShoppingList[thirdId - 1]
            console.log(thirdShoppingItem)
            return ShoppingList.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdShoppingItem.name,
                        price: thirdShoppingItem.price,
                        category: thirdShoppingItem.category,
                        checked: thirdShoppingItem.checked,
                        date_added: thirdShoppingItem.date_added
                    })
                })
        })
        it(`deleteShoppingitem() removes an item by id from 'shopping_list' table`, () => {
                 const itemId = 3
                 return ShoppingList.deleteShoppingItem(db, itemId)
                   .then(() => ShoppingList.getShoppingList(db))
                   .then(allShoppingItems => {
                     // copy the test articles array without the "deleted" article
                     const expected = testShoppingList.filter(item => item.id !== itemId)
                     expect(allShoppingItems).to.eql(expected)
                   })
               })
        it(`updateShoppingItem() updates an item from the 'shopping-list' table`, () => {
            const idOfItemToUpdate = 3
            const newShoppingItem = {
                name: 'Test new item!',
                price: '0.00',
                category: 'Main',
                checked: true,
                date_added: new Date('2020-01-01T00:00:00.000Z')
            }
            return ShoppingList.updateShoppingItem(db, idOfItemToUpdate, newShoppingItem)
                .then(() => ShoppingList.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newShoppingItem,
                    })
                })

        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getShoppingList() resolves an empty array`, () => {
            return ShoppingList.getShoppingList(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertShoppingItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newShoppingItem = {
                name: 'Test new item!',
                price: '0.00',
                category: 'Main',
                checked: true,
                date_added: new Date('2020-01-01T00:00:00.000Z')
            }
            return ShoppingList.insertShoppingItem(db, newShoppingItem)
                .then(actual => {
                    console.log(actual);
                    expect(actual).to.eql({
                        id: 1,
                        name: newShoppingItem.name,
                        price: newShoppingItem.price,
                        category: newShoppingItem.category,
                        checked: newShoppingItem.checked,
                        date_added: new Date(newShoppingItem.date_added),
                    })
                })
        })

        
    })
})