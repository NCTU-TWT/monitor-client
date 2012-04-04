(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      io: 'lib/socket.io.min.amd',
      raphael: 'lib/raphael-min',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });

  require(['jquery', 'io', 'raphael', 'underscore', 'backbone', 'hogan'], function($, io, Raphael, _, Backbone, hogan) {
    var AppView, Chart, ChartView, Charts, Session, SessionView, Sessions, app, sessions, socket;
    Chart = (function(_super) {

      __extends(Chart, _super);

      function Chart() {
        Chart.__super__.constructor.apply(this, arguments);
      }

      return Chart;

    })(Backbone.Model);
    Charts = (function(_super) {

      __extends(Charts, _super);

      function Charts() {
        Charts.__super__.constructor.apply(this, arguments);
      }

      return Charts;

    })(Backbone.Collection);
    Chart = (function(_super) {

      __extends(Chart, _super);

      function Chart() {
        Chart.__super__.constructor.apply(this, arguments);
      }

      Chart.prototype.initialize = function(data) {};

      return Chart;

    })(Backbone.Model);
    Charts = (function(_super) {

      __extends(Charts, _super);

      function Charts() {
        Charts.__super__.constructor.apply(this, arguments);
      }

      Charts.prototype.model = Chart;

      return Charts;

    })(Backbone.Collection);
    Session = (function(_super) {

      __extends(Session, _super);

      function Session() {
        Session.__super__.constructor.apply(this, arguments);
      }

      Session.prototype.initialize = function(data) {
        this.collection = new Charts(data);
        return this.id = data[0].session;
      };

      return Session;

    })(Backbone.Model);
    Sessions = (function(_super) {

      __extends(Sessions, _super);

      function Sessions() {
        Sessions.__super__.constructor.apply(this, arguments);
      }

      Sessions.prototype.url = '/sessions';

      Sessions.prototype.parse = function(reply) {
        var session, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = reply.length; _i < _len; _i++) {
          session = reply[_i];
          _results.push(this.add(new Session(session)));
        }
        return _results;
      };

      return Sessions;

    })(Backbone.Collection);
    ChartView = (function(_super) {

      __extends(ChartView, _super);

      function ChartView() {
        ChartView.__super__.constructor.apply(this, arguments);
      }

      ChartView.prototype.template = hogan.compile($('#chart-template').text());

      ChartView.prototype.className = 'chart';

      ChartView.prototype.render = function() {
        console.log(this.model);
        this.$el.html(this.template.render({
          name: this.model.get('name')
        }));
        return this;
      };

      return ChartView;

    })(Backbone.View);
    SessionView = (function(_super) {

      __extends(SessionView, _super);

      function SessionView() {
        SessionView.__super__.constructor.apply(this, arguments);
      }

      SessionView.prototype.events = {
        'click': 'select'
      };

      SessionView.prototype.tagName = 'li';

      SessionView.prototype.template = hogan.compile($('#session-template').text());

      SessionView.prototype.render = function() {
        this.$el.html(this.template.render({
          id: this.model.id
        }));
        return this;
      };

      SessionView.prototype.select = function() {
        var chart, chartView, _i, _len, _ref, _results;
        $('#sidebar li').removeClass('selected');
        this.$el.addClass('selected');
        $('#charts').empty();
        _ref = this.model.collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chart = _ref[_i];
          chartView = new ChartView({
            model: chart
          });
          $('#charts').append(chartView.render().el);
          _results.push(console.log(chart));
        }
        return _results;
      };

      return SessionView;

    })(Backbone.View);
    AppView = (function(_super) {

      __extends(AppView, _super);

      function AppView() {
        this.addSession = __bind(this.addSession, this);
        AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = $('body');

      AppView.prototype.template = hogan.compile($('#session').text());

      AppView.prototype.initialize = function() {
        return this.model.on('add', this.addSession);
      };

      AppView.prototype.addSession = function(model) {
        var sessionView;
        sessionView = new SessionView({
          model: model
        });
        return $('#sidebar ul').append(sessionView.render().el);
      };

      return AppView;

    })(Backbone.View);
    sessions = new Sessions;
    app = new AppView({
      model: sessions
    });
    socket = io.connect();
    socket.on('header', function(data) {
      return console.log(data);
    });
    socket.on('data', function(data) {
      return console.log(data);
    });
    return $(function() {
      return sessions.fetch();
    });
  });

}).call(this);
