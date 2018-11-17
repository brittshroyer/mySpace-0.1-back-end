var User = function() {

  var mongoose = require('mongoose'),
      ObjectId = mongoose.Schema.Types.ObjectId,
      schema,
      model;

  schema = new mongoose.Schema({
    email: String,
    name: String,
    description: String
  });

  schema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  schema.set('toJSON', {virtuals: true});

  // schema.plugin(timestamps);

  model = mongoose.model('user', schema);

  return {schema: schema,
          model: model};

}();

module.exports = User;
