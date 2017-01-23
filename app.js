// Backbone Model
var Human = Backbone.Model.extend({
  defaults: {
    name: '',
    age: ''
  }
});

// Backbone Collection
var Humans = Backbone.Collection.extend({});

// example: instantiate two humans
/*
var humanA = new Human({
  name: 'John',
  age: '20'
});

var humanB = new Human({
  name: 'Alicia',
  age: '30'
});
*/

// instantiate a Collection
var humans = new Humans();

// Backbone View for one human
var HumanView = Backbone.View.extend({
  model: new Human(),
  tagName: 'tr',
  initialize: function() {
    this.template = _.template($('.humans-list-template').html());
  },
  events: {
    'click .edit-human': 'edit',
    'click .update-human': 'update',
    'click .cancel': 'cancel',
    'click .delete-human': 'delete'
  },
  edit: function() {
    $('.edit-human').hide();
    $('.delete-human').hide();
    this.$('.update-human').show();
    this.$('.cancel').show();

    var name = this.$('.name').html();
    var age = this.$('.age').html();

    this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
    this.$('.age').html('<input type="text" class="form-control age-update" value="' + age + '">');
  },
  update: function() {
    this.model.set('name', $('.name-update').val());
    this.model.set('age', $('.age-update').val());
  },
  cancel: function() {
    humansView.render();
  },
  delete: function() {
    this.model.destroy();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});
// Backbone View for all humans
var HumansView = Backbone.View.extend({
  model: humans,
  el: $('.humans-list'),
  initialize: function() {
    var self = this;
    this.model.on('add', this.render, this);
    this.model.on('change', function() {
      setTimeout(function() {
        self.render();
      }, 30);
    }, this);
    this.model.on('remove', this.render, this);
  },
  render: function() {
    var self = this;
    this.$el.html('');
    _.each(this.model.toArray(), function(human){
      self.$el.append((new HumanView({model: human})).render().$el);
    });
    return this;
  }
});

var humansView = new HumansView();

$(document).ready(function() {
  $('.add-human').on('click', function(){
    var human = new Human({
      name: $('.name-input').val(),
      age: $('.age-input').val()
    });
    $('.name-input').val('');
    $('.age-input').val('');
    console.log(human.toJSON());
    humans.add(human);
  });
});
