
    module.exports = function (app) {
        const modelName = 'review_details';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            bookName: { type: String, required: true },
userName: { type: String, required: true },
rating: { type: Number, required: false, min: 0, max: 10000000 },
reviewText: { type: String, required: true },
createdAt: { type: Date, required: false },
isApproved: { type: Boolean, required: false },

            
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