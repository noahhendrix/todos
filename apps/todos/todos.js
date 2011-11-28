// ==========================================================================
// Project:   Todos
// Copyright: @2011 Noah Hendrix
// ==========================================================================
/*globals Todos */

var Todos = SC.Application.create({
  store: SC.Store.create()
});

// Models
  Todos.Todo = SC.Record.extend({
    title: SC.Record.attr(String),
    isDone: SC.Record.attr(Boolean, { defaultValue: NO })
  });

// Views
  Todos.CreateTodoView = SC.TextField.extend({
    insertNewline: function() {
      var value = this.get('value');

      if (value) {
        this.set('value', '');
        return Todos.todoListController.createTodo(value);
      }
    }
  });
  
  Todos.MarkDoneView = SC.Checkbox.extend({
    titleBinding: '.parentView.content.title',
    valueBinding: '.parentView.content.isDone'
  });
  
  Todos.StatsView = SC.TemplateView.extend({
    remainingBinding: 'Todos.todoListController.remaining',

    displayRemaining: function() {
      var remaining = this.get('remaining');
      return remaining + (remaining === 1 ? " item" : " items");
    }.property('remaining')
  });

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });
  
  var todos = Todos.store.find(Todos.Todo);
  Todos.todoListController.set('content', todos);
});

// Controllers
  Todos.todoListController = SC.ArrayController.create({
    // Initialize the array controller with an empty array.
    content: [],

    // Creates a new todo with the passed title, then adds it
    // to the array.
    createTodo: function(title, isDone) {
      if (isDone == undefined)
        var isDone = false;
      
      return Todos.store.createRecord(Todos.Todo, {
        title: title,
        isDone: isDone
      });
    },
    
    remaining: function() {
      return this.filterProperty('isDone', false).get('length');
    }.property('@each.isDone'),
    
    clearCompletedTodos: function() {
      this.filterProperty('isDone', true).forEach(function(item) {
        item.destroy();
      });
    },
    
    allAreDone: function(key, value) {
      if (value !== undefined) {
        this.setEach('isDone', value);
        return value;
      } else {
        return this.get('length') && this.everyProperty('isDone', true);
      }
    }.property('@each.isDone')
    
  });