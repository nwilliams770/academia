;(function (global, $) {
  //  'new' an object
  const Greetr = function(firstName, lastName, language) {
    return new Greetr.init(firstName, lastName, language);
  };

  // hidden within scope of IIFE and never directly accessible
  const supportedLangs = ['en', 'es'];

  const greetings = {
    en: 'Hello',
    es: 'Hola'
  };

  const formalGreetings = {
    en: 'Greetings',
    es: 'Saludos'
  };

  const logMessages = {
    en: 'Logged in',
    es: 'Inicio sesion'
  };

  Greetr.prototype = {
    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    },
    validate: function () {
     if (supportedLangs.indexOf(this.language) === -1) {
        throw "Invalid language";
      }
    },
    greeting: function () {
      return greetings[this.language] + ' ' + this.firstName + '!';
    },
    formalGreeting: function () {
      return formalGreetings[this.language] + ' ' + this.fullName();
    },
    greet: function (formal) {
      let msg;
      if (formal) {
        msg = this.formalGreeting();
      } else {
        msg = this.greeting();
      }

      // IE doesn't have console variable if it's not open, so we add this
      // to prevent any potential errors
      if (console) {
        console.log(msg);
      }
      // this refers to the calling object at execution time
      // makes the method chainable
      return this;
    },
    log: function() {
      if (console) {
        console.log(logMessages[this.language] + ':' +
        this.fullName());
      }

      return this;
    },
    setLang: function(lang) {
      this.language = lang;
      this.validate();
      return this;
    },

    HTMLGreeting: function(selector, formal) {
      if (!$) {
        throw 'jQuery not loaded';
      }

      if (!selector) {
        throw 'Missing jQuery selector';
      } 
      let msg;

      if (formal) {
        msg = this.formalGreeting();
      } else {
        msg = this.greeting();
      }

      $(selector).html(msg);

      return this;
    }

  };

  Greetr.init = function(firstName, lastName, language) {
    let self = this;
    self.firstName = firstName || '';
    self.lastName = lastName || '';
    self.language = language || 'en';
    
    self.validate();
  };

  // we're just doing this because it looks cleaner to update the Greetr.prototype
  // as opposed to Greetr.init.prototype
  Greetr.init.prototype = Greetr.prototype;

  // exposing this func to the global object and giving it an alias
  global.Greetr = global.G$ = Greetr;

} (window, jQuery));