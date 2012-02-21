require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        io: 'lib/socket.io.min.amd'
        raphael: 'lib/raphael-min'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        hogan: 'lib/hogan-1.0.5.min.amd'
        
require ['jquery','io', 'raphael', 'underscore', 'backbone', 'hogan'], ($, io, Raphael, _, Backbone, hogan) ->


    class Chart extends Backbone.Model
        initialize: (data) ->
            #console.log 'chart'
            #console.log data

    class Charts extends Backbone.Collection
        
        model: Chart
        


    class Session extends Backbone.Model
    
        initialize: (data) ->
            @collection = new Charts data
            
            # sessionID as ID
            @id = data[0].session
        
    
    class Sessions extends Backbone.Collection
        
        url: '/sessions'
        
        parse: (reply) ->
            for session in reply
                @add new Session session
    
    
    class ChartView extends Backbone.View
        
        template: hogan.compile $('#chart-template').text()
        
        className: 'chart'
        
        render: ->
        
            console.log @model
            @$el.html @template.render
                name: @model.cid
            return @
    
    class SessionView extends Backbone.View
        
        events: 
            'click': 'select'
                     
        tagName: 'li'
        
        
        template: hogan.compile $('#session-template').text()
               
                 
        render: ->
        
            @$el.html @template.render
                id: @model.id                
                                    
            return @
            
        select: ->
        
            # addClass
            $('#sessions li').removeClass 'selected'
            @$el.addClass 'selected'
        
            # remove the former content
            $('#charts').empty()
        
        
            for chart in @model.collection.models
                chartView = new ChartView
                    model: chart
                $('#charts').append chartView.render().el
            
    class AppView extends Backbone.View
        
        el: $('body')
                
        template: hogan.compile $('#session').text()
        
        initialize: ->
            @model.on 'add', @addSession
            
                
        addSession: (model) =>
        
            sessionView = new SessionView
                model: model                
            $('#sessions ul').append sessionView.render().el
            
    
    #
    #   Initialize
    #
    
    sessions = new Sessions
    app = new AppView
        model: sessions
    
    $ ->
        sessions.fetch()
