const toastError = require('../../helpers/toastConnectionError');
const User = require('../../models/User');
const CurrentUser = require('../../models/CurrentUser');
const messages = require('../../../../../tmp/messages.json');
const template = require('../../../../../views/application_sub_views/register.erb');

module.exports = Mn.View.extend({
  template: template,
  className: 'col-lg-6 offset-lg-3',
  _username_preview: _.template('Username: <strong>{{= username }}</strong>'),
  _email_preview: _.template('Email: <strong>{{= email }}</strong>'),
  _inputs: ['#username', '#email', '#password', '#repeat'],
  _image_dimension: {'height':300, 'width':300},
  _length: {'username': 6, 'email': 3},
  regions: {
    login: '#register-region'
  },
  triggers: {
    'click a.switch': 'switch_login'
  },
  events: {
    'focusout input#username': function(event) {
	    if (this.checkLength(event, 'username')) {
	      this.checkAlReadyUse(event);
      }
    },
    'focusout input#email': function(event) {
	    if (this.checkLength(event, 'email')) {
		    this.checkAlReadyUse(event);
	    }
    },
    'focusout input#password': 'checkSecurityLevel',
    'focusout input#repeat':   'checkPasswordMatches',
    'keypress input#password': 'checkSecurityLevel',
    'click button#continue':   'showFieldsetImage',
    'click button#back':       'showFieldsetInformation',
    'click button#submit':     'submitForm',
    'change input#inputFile':  'readUrl',
    'click button#trigger-image-input': 'triggerFileUpload'
  },
  ui: {
    submit: '#submit',
    switch: 'a.switch',
    image_preview: '#preview-image',
    fieldset_information: '.fieldset-information',
    fieldset_image: '.fieldset-image',
    inputEmail: 'input#email',
    inputUsername: 'input#username',
    inputImage: 'input#inputFile',
    inputRepeat: 'input#repeat',
    inputPassword: 'input#password'
  },
  templateContext: function () {
    return {
      mode: this.getOption('mode')
    }
  },
  onRender: function () {
    if (this.model) { // If the mode if edit profile
      var input = this.getUI('inputImage'),
          image_preview = this.getUI('image_preview'),
          submit = this.getUI('submit'),
          img = new Image();

      this.getUI('inputEmail').addClass('valid');
      this.getUI('inputUsername').addClass('valid');

      img.onload = function(e) {
        input.attr('data-title', 'Current image');
        image_preview.attr('src', e.target.src);
        submit.attr('disabled', false);
      };

      img.src = this.model.get('image_profile');
    }
  },
  checkLength: function(event, type) {
    /* Check if the length if minor than 6 letters
     * */
    var input = $(event.currentTarget);
    
    if (input.val().trim().length <= this._length[type]) {
	    $.toast({
		    heading: 'Warning',
		    text: 'This field need more than ' + this._length[type] + ' characters',
		    icon: 'warning',
		    showHideTransition: 'slide'
	    });
	    input.removeClass('valid');
      return false;
    }
    return true
  },
  checkAlReadyUse: function (event) {
    // Check if the email or username is already use
    var input = $(event.currentTarget),
        data;
    
    if (input.is('#email')) {
      data = {email: input.val().trim()}
    } else if (input.is('#username')) {
      data = {username: input.val().trim()}
    }

    if (this.model && (data.email === this.model.get('email') ||
                       data.username === this.model.get('name') ||
		                   data.username === this.model.get('username'))) {
      input.removeClass('invalid').addClass('valid');
    } else {
      $.ajax({
        url: '/api/validation',
        type: 'GET',
        dataType: 'json',
        data: data,
        success: function(response) {
          if (response.status === 'success') {
            input.removeClass('invalid').addClass('valid');
          }
          else if (response.status === 'fail') {
            input.removeClass('valid').addClass('invalid');
          }
        }
      });
    }
  },
  checkSecurityLevel: function(event) {
    // Add a color border
    var input = $(event.currentTarget);

    if (input.val().length <= 6) {
      input.removeClass('security-medium security-high valid')
        .addClass('security-down');
    }
    else if (input.val().length > 6 && input.val().length <= 12) {
      input.removeClass('security-down security-high')
        .addClass('security-medium valid')
    }
    else {
      input.removeClass('security-medium security-down')
        .addClass('security-high valid')
    }
  },
  checkPasswordMatches: function(event) {
    // Check matches between password and password repeat
    var input = $(event.currentTarget),
        password_input = $('input#password');
    if (input.val() === password_input.val()) {
      input.removeClass('invalid').addClass('valid');
	    password_input.removeClass('invalid').addClass('valid')
    } else {
      input.removeClass('valid').addClass('invalid')
    }
  },
  showFieldsetImage: function () {
    /*
     * Chech if all values are valid
     * Add username and email preview data and
     * Show fieldset image or show toast if not have image profile
     * */
	  var isValid = true;
	  
	  this._inputs.forEach(function (inputId) {
		  if (!$('input' + inputId).hasClass('valid')) {
			  isValid = false;
			  return
		  }
	  });
	
	  if (isValid) {
      $('#preview-username').html(
        this._username_preview({username:$('input#username').val()})
      );
      
      $('#preview-email').html(
        this._email_preview({email:$('input#email').val()})
      );
      
      this.getUI('fieldset_information').addClass('hidden-element');

      this.getUI('fieldset_image').removeClass('hidden-element');
    }
  },
  showFieldsetInformation: function () {
    /*
     * Show fieldset information
     * */
    this.getUI('fieldset_information').removeClass('hidden-element');
    this.getUI('fieldset_image').addClass('hidden-element');
  },
  readUrl: function(event) {
    // Validate size of image and show image preview
    var input = event.currentTarget,
      _URL = window.URL || window.webkitURL,
      max_width = this._image_dimension.width,
      max_height = this._image_dimension.height,
      submit = this.getUI('submit'),
      image_preview = this.getUI('image_preview');
    if (input.files && input.files[0]) {
      var img = new Image();
      img.onload = function(e) {
        var width = img.naturalWidth, height = img.naturalHeight;
        if (width <= max_width && height <= max_height ) {
          input.setAttribute('data-title', input.files[0].name);
          image_preview.attr('src', e.target.src);
          submit.attr('disabled', false);
        }
        else {
          $.toast({
            heading: 'Error',
            text: 'Your image should be ' + max_height + ' px wide and '
            + max_height + ' px and ' + max_height + ' long or smaller',
            icon: 'error',
            showHideTransition: 'slide'
          });
        }
      };
      img.src = _URL.createObjectURL(input.files[0]);
    }
  },
  triggerFileUpload: function () {
    document.getElementById('inputFile').click();
  },
  submitForm: function () {
    var submitButton = this.getUI('submit'),
        switchButton = this.getUI('switch'),
        image = $('input#inputFile').prop('files'),
        reader = new FileReader(), user = this.model || new User(),
        that = this;

    submitButton.attr('disabled', true); // Prevent send several ajax

    if (image.length === 1) {
      /*
      * If the input file have a image
      * */
      reader.onloadend = function () {
        user.save({
          name: $('input#username').val().trim(),
          email: $('input#email').val().trim(),
          password: $('input#password').val().trim(),
          password_confirmation: $('input#repeat').val().trim(),
          image_profile: reader.result
        }, {
          wait: true,
          success: function () {
            switchButton.trigger('click'); // Render login form
            that.toastSuccess();
            if (user instanceof CurrentUser) {
              user.unset('password')
              user.unset('password_confirmation')
            }
          },
          error: function () {
            submitButton.attr('disabled', false);
            toastError();
          }
        });
      };

      reader.readAsDataURL(image[0]);
    }

    else if (user instanceof CurrentUser && image.length === 0) {
      /*
       * If user authenticated try edit profile but no change the image profile
       * */
      user.save({
        name: $('input#username').val().trim(),
        email: $('input#email').val().trim(),
        password: $('input#password').val().trim(),
        password_confirmation: $('input#repeat').val().trim(),
        image_profile: user.get('image_profile')
      }, {
        wait: true,
        success: function () {
          that.toastSuccess();
          user.unset('password');
          user.unset('password_confirmation');
	        Backbone.history.navigate('user/' + user.get('id'), {trigger: true});
        },
        error: function () {
          submitButton.attr('disabled', false);
          toastError();
        }
      });
    }

    else {
      // If guest user try register without image profile
      submitButton.attr('disabled', false);
    }
  },
  toastSuccess: function() {
    $.toast({
      heading: 'Success',
      text: messages['user'].register.success,
      icon: 'success',
      showHideTransition: 'slide'
    });
  }
});