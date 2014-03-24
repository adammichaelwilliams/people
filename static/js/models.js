
window.Person = Backbone.Model.extend({

    urlRoot: "/people",

    initialize: function() {
        this.on("change", function (model, options) {
            if(options && options.save === false) return;
            model.save();
        });
    }
});
    

window.PeopleCollection = Backbone.Collection.extend({

    model: Person,

    url: "/table"

});

window.Skill = Backbone.Model.extend({

    urlRoot: "/skills",

    initialize: function() {
        this.on("change", function (model, options) {
            if(options && options.save === false) return;
            model.save();
        });
    }
});
    

window.SkillCollection = Backbone.Collection.extend({

    model: Skill,

    url: "/skills"

});

