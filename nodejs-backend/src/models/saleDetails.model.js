
    module.exports = function (app) {
        const modelName = 'sale_details';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            bookName: { type: Schema.Types.ObjectId, ref: "book_details" },
customerName: { type: String, required: true, maxLength: null },
saleDate: { type: Date, required: false },
quantitySold: { type: Number, required: false, min: 0, max: 1000000 },

            
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