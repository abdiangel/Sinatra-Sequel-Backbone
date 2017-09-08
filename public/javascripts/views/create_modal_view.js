var app = app || {};

app.CreateChoiceModalView = Mn.View.extend({
  el: '#container-modal',
  template: '#modal-create',
  events:{
    'mouseover @ui.choice_snippet': 'switchDescription',
    'mouseover @ui.choice_proyect': 'switchDescription',
    'click @ui.choice_snippet': 'redirectToChoice',
    'click @ui.choice_proyect': 'redirectToChoice',
    'click @ui.close': 'hideModal'
  },
  ui: {
    modal: '.modal',
    close: '.close',
    description: '#option-description',
    choice_proyect: 'a#choice-proyect',
    choice_snippet: 'a#choice-snippet'
  },
  initialize: function(){
    this.current_description = 'choice_proyect';
  },
  onRender: function() {
    this.getUI('modal').modal('show');
    this.getUI('description').text(
      this.getUI(this.current_description).data('description')
    );
  },
  switchDescription: function (event) {
    /*
    * Check if the current description showed if the same of mouseover
    * Then show or not
    * */
    if (this.current_description !== $(event.target).attr('id')) {
      this.getUI('description').text(
        $(event.target).data('description')
      );
      this.current_description = $(event.target).attr('id');
    }
  },
  hideModal: function () {
    this.getUI('modal').modal('hide');
  },
  redirectToChoice: function (event) {
    var choice = $(event.target);
    if (choice.attr('id') === 'choice-snippet') {
      app.userAuthRouter.navigate('create/snippet', {trigger: true});
    }
    else if (choice.attr('id') === 'choice-proyect') {
      app.userAuthRouter.navigate('create/proyect', {trigger: true});
    }
  }
});