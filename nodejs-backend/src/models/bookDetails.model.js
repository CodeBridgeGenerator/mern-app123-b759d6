
    module.exports = function (app) {
        const modelName = 'book_details';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            bookName: { type: String, required: true, minLength: null, maxLength: null },
authorName: { type: Schema.Types.ObjectId, ref: "author_details" },
publicationDate: { type: Date, required: false },
price: { type: Number, required: false, min: 0, max: 1000000 },
quantityInStock: { type: Number, required: false, min: 0, max: 1000000 },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };