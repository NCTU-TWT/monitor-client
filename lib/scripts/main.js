(function() {
<<<<<<< HEAD
=======
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };
>>>>>>> dev

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
<<<<<<< HEAD
    var socket;
    socket = io.connect();
    socket.on('chart', function(data) {
      return console.log(data);
    });
    return socket.on('stream', function(data) {
      return console.log(data);
=======
    var Chart, Charts, Session, Sessions, Sidebar, sessions, sidebar;
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
        console.log(data);
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
    Sidebar = (function(_super) {

      __extends(Sidebar, _super);

      function Sidebar() {
        Sidebar.__super__.constructor.apply(this, arguments);
      }

      Sidebar.prototype.el = $('#sessions');

      Sidebar.prototype.template = hogan.compile($('#session').text());

      Sidebar.prototype.initialize = function() {
        var _this = this;
        return this.model.on('add', function(model) {
          return $('ul', _this.el).append(_this.template.render({
            id: model.id
          }));
        });
      };

      return Sidebar;

    })(Backbone.View);
    sessions = new Sessions;
    sidebar = new Sidebar({
      model: sessions
    });
    return $(function() {
      return sessions.fetch();
>>>>>>> dev
    });
  });

}).call(this);
