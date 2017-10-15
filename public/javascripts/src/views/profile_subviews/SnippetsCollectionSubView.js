const Collection = require('../../collections/UserSnippetsCollection')

module.exports = Mn.CollectionView.extend({
  className: 'row mt-3',
  collectionEvents: {
    'sync': 'CheckIfEmpty'
  },
  initialize: function() {
    this.user_id = this.options.user_id;
    this.childView = Mn.View.extend({
      template: '#sub-view-snippet',
      className: 'col-lg-6'
    });
    this.collection = new Collection([], {
      user_id: this.user_id,
      limit: 4
    });
    this.collection.fetch({
      success: function () {
        prettyPrint() // Code Prettify
      }
    });
  },
  CheckIfEmpty: function () {
    if (this.collection.length === 0){
      this.trigger('noHaveSnippets');
    }
  }
});