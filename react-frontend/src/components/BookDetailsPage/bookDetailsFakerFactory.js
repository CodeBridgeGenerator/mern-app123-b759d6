
import { faker } from "@faker-js/faker";
export default (user,count,authorNameIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
bookName: faker.lorem.sentence(1),
authorName: authorNameIds[i % authorNameIds.length],
publicationDate: faker.lorem.sentence(1),
price: faker.lorem.sentence(1),
quantityInStock: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
