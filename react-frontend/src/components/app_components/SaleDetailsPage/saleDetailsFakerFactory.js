
import { faker } from "@faker-js/faker";
export default (user,count,bookNameIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
bookName: bookNameIds[i % bookNameIds.length],
customerName: faker.lorem.sentence(1),
saleDate: faker.lorem.sentence(1),
quantitySold: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
