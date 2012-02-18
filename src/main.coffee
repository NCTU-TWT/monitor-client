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
            console.log data
            
            # sessionID as ID
            @id = data[0].session
        
    
    class Sessions extends Backbone.Collection
        
        url: '/sessions'
        
        parse: (reply) ->
            for session in reply
                @add new Session session
    
    
    
    class Sidebar extends Backbone.View
        
        el: $('#sessions')
                
        template: hogan.compile $('#session').text()
        
        initialize: ->
            @model.on 'add', (model) =>
                
                $('ul', @el).append @template.render
                    id: model.id
    #
    #   Initialize
    #
    
    sessions = new Sessions
    sidebar = new Sidebar
        model: sessions
    
    $ ->
        sessions.fetch()
