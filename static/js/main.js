

var AppRouter = Backbone.Router.extend({


    routes: {
        ""        : "table",
        "home"        : "main",
        "people"  : "list",
        "table"   : "table"
    },

    initialize: function() {
    },

    main: function() {
        if(!this.mainView) {
            this.mainView = new MainView();
        }
        var peopleList = new PeopleCollection();
//        peopleList.fetch({success: function() {
//            $("#content").html(new PeopleListView({model: peopleList}).el);
//        }});
        $("#content").html(this.mainView.el);
    },

    list: function() {
        if(!this.mainView) {
            this.mainView = new MainView();
        }
        var peopleList = new PeopleCollection();
        peopleList.fetch({success: function() {
            $("#content").html(new PeopleListView({model: peopleList}).el);
        }});
    },

    table: function() {

    //TODO all of this logic should go into view/elsewhere
    // the column/skill model/collection is bullshit and should
    // be handled in a much different fashion
    // Here we've got a jerry-rigged column list based off a 
    // largely unused Backgrid.Columns collection
    // Ideally the columns would represent the total list of skills
    // at any given time, added and remove dynamically.
    // This essentially does that, but not quite as well as we'd like
    // for instance the saving of a changed skill isn't built in yet
        //Create TableView if doesn't exist
        if(!this.tableView) {

            this.peopleList = new PeopleCollection();
            skillColumns = Backgrid.Columns.extend({
                url: "/skills"
            });
            var skills = new skillColumns();
            skills.comparator = function(model) {
                return model.get('id')
            }
            var scope = this;
            skills.fetch({ success: function() {

                scope.peopleList.comparator = function(model) {
                    return -model.get('id')
                }
                scope.peopleList.fetch({reset: true}).done(function() {

                    
                    scope.tableView = new TableView({model: { peopleList: scope.peopleList, skills: skills}} );
                    $("#content").html(scope.tableView.el);
                    // Hack for vertical headers
                    var counter = 1000; // Max 1000 cols
                    $.each($('th'),function(index,col){
                        $(col).html('<div>'+$(col).html()+"</div>");
                        // this line fixes not working sortBy columns due to overlapping divs
                        $(col).css('z-index',counter--); 
                    });
                });
            }});
        } else {
            console.log("alreadyrendered");
            //Render Tableview
            $("#content").html(this.tableView.el);
            //Update people collection
            this.peopleList.fetch();
        }

    
    }
});



jQuery(document).ready(function($) {

    app = new AppRouter();
    Backbone.history.start();

});
