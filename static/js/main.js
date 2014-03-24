


var AppRouter = Backbone.Router.extend({


    routes: {
        ""        : "main",
        "people"  : "list",
        "table"   : "table"
    },

    initialize: function() {
    },

    main: function() {
        if(!this.mainView) {
            this.mainView = new mainView();
        }
        var peopleList = new PeopleCollection();
//        peopleList.fetch({success: function() {
//            $("#content").html(new PeopleListView({model: peopleList}).el);
//        }});
        $("#content").html(this.mainView.el);
    },

    list: function() {
        if(!this.mainView) {
            this.mainView = new mainView();
        }
        var peopleList = new PeopleCollection();
        peopleList.fetch({success: function() {
            $("#content").html(new PeopleListView({model: peopleList}).el);
        }});
    },
    table: function() {
        var peopleList = new PeopleCollection();

        var columns = [{
                name: "title",
                label: "Title",
                cell: "string"
            }, {
                name: "url",
                label: "URL",
                cell: "string"
            }];
        var grid = new Backgrid.Grid({
            columns: columns,
            collection: peopleList
        });

        $('#content').html(grid.render().el);

        peopleList.fetch({reset: true}); 

/*                
        peopleList.fetch({success: function() {
            $("#content").html(new tableView({model: peopleList}).el);
        }});
*/
    }
});



jQuery(document).ready(function($) {

    app = new AppRouter();
    Backbone.history.start();

});
