(function() {
  var $, App, Expression, Results, TestStrings,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Expression = (function(_super) {

    __extends(Expression, _super);

    function Expression() {
      Expression.__super__.constructor.apply(this, arguments);
    }

    Expression.prototype.elements = {
      'input[name=expression]': 'regexp',
      'input[name=option]': 'option'
    };

    Expression.prototype.events = {
      'keyup input': 'onKeyPress'
    };

    Expression.prototype.onKeyPress = function(event) {
      try {
        this.value = new RegExp(this.regexp.val(), this.option.val());
      } catch (error) {

      }
      return this.trigger('update');
    };

    return Expression;

  })(Spine.Controller);

  TestStrings = (function(_super) {

    __extends(TestStrings, _super);

    function TestStrings() {
      TestStrings.__super__.constructor.apply(this, arguments);
    }

    TestStrings.prototype.elements = {
      'textarea': 'input'
    };

    TestStrings.prototype.events = {
      'keyup textarea': 'onKeyPress'
    };

    TestStrings.prototype.onKeyPress = function(event) {
      this.getValues(this.input.val());
      return this.trigger('update');
    };

    TestStrings.prototype.getValues = function(val) {
      return this.values = val.split('\n');
    };

    return TestStrings;

  })(Spine.Controller);

  Results = (function() {

    function Results(expression, test_strings) {
      this.expression = expression;
      this.test_strings = test_strings;
      this.compile = __bind(this.compile, this);
      this.expression.bind('update', this.compile);
      this.test_strings.bind('update', this.compile);
    }

    Results.prototype.compile = function() {
      var count, value, _i, _len, _ref;
      $('ul#results').empty();
      $('ul#groups').empty();
      count = 1;
      if (this.expression.regexp.val() === '' && this.test_strings.input.val() === '') {
        $('#error').hide();
        $('#output').hide();
        $('#intro').show();
      } else if (this.expression.regexp.val() === '') {
        $('#intro').hide();
        $('#output').hide();
        $('#error').show();
        return true;
      }
      try {
        _ref = this.test_strings.values;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          value = _ref[_i];
          this.matchResults(value);
          this.matchGroups(value, count);
          count += 1;
        }
        $('#intro').hide();
        $('#error').hide();
        return $('#output').show();
      } catch (error) {
        $('#intro').hide();
        $('#output').hide();
        return $('#error').show();
      }
    };

    Results.prototype.matchResults = function(value) {
      var match, _i, _len, _ref;
      _ref = value.match(this.expression.value);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        match = _ref[_i];
        value = this.expression.option.val() === 'g' ? value.replace(new RegExp(match, 'g'), "<span>" + match + "</span>") : value.replace(new RegExp(match), "<span>" + match + "</span>");
      }
      return $('ul#results').append("<li>" + value + "</li>");
    };

    Results.prototype.matchGroups = function(value, count) {
      var match, _i, _len, _ref, _results;
      $('ul#groups').append("<li id='match_" + count + "'><h3>Match " + count + "</h3><ol></ol></li>");
      _ref = value.match(this.expression.value);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        match = _ref[_i];
        _results.push($("ul#groups li#match_" + count + " ol").append("<li>" + match + "</li>"));
      }
      return _results;
    };

    return Results;

  })();

  App = (function() {

    function App() {
      this.expression = new Expression({
        el: '#expression'
      });
      this.test_strings = new TestStrings({
        el: '#test_strings'
      });
      this.results = new Results(this.expression, this.test_strings);
    }

    return App;

  })();

  $(function() {
    return new App;
  });

}).call(this);
