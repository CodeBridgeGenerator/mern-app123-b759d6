
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
bookName: faker.datatype.boolean(""),
userName: faker.datatype.boolean(""),
rating: faker.datatype.boolean(""),
reviewText: faker.datatype.boolean(""),
createdAt: faker.datatype.boolean(""),
isApproved: faker.datatype.boolean(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
