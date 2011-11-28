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
    isDone: SC.Record.attr(Boolean, { defaultValue: NO }),
    tags: SC.Record.toMany('Todos.Tag', { isMaster: YES, inverse: 'todos' }),
    
    addTag:function(tag) {
      this.get('tags').pushObject(tag);
    },
    
    removeTag:function(tag) {
      this.get('tags').removeObject(tag);
    }
  });
  
  Todos.Tag = SC.Record.extend({
    title: SC.Record.attr(String),
    todos: SC.Record.toMany('Todos.Todo', { isMaster: NO, inverse: 'tags' })
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
  
  Todos.FilterView = SC.TextField.extend({
    insertNewline: function() {
      var query = this.get('value');
      Todos.todoListController.filterByTag(query);
    },
    
    cancel: function() {
      this.set('value', '');
      this.insertNewline();
    }
  });
  
  Todos.TodosListView = SC.TemplateCollectionView.extend({
    itemView: SC.TemplateView.extend({
      doubleClick: function(item) {
        $(item.target).toggleClass('edit');
      }
    })
  });
  
  Todos.AddTagView = SC.TextField.extend({
    todoBinding: '.parentView.content',
    
    findOrCreateTag: function(title) {
      var q = SC.Query.create({
        conditions: "title = %@",
        parameters: [title],
        recordType: Todos.Tag
      });
      
      var tag = Todos.store.find(q).firstObject();
      if(tag)
        return tag;
      else {
        return Todos.store.createRecord(Todos.Tag, {
          title: title
        }, Math.random(Math.floor(Math.random() * 99999999)));
      }
    },
    
    insertNewline: function() {
      var todo = this.get('todo');
      var tag_name = this.get('value');
      var tag = this.findOrCreateTag(tag_name);
      todo.addTag(tag);
      this.set('value', '');
    },
    
    cancel: function() {
      this.set('value', '');
    }
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
      }, Math.random(Math.floor(Math.random() * 99999999)));
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
    }.property('@each.isDone'),
    
    filterByTag: function(tag_query) {
      if(tag_query == '' || tag_query == undefined) {
        var todos = Todos.store.find(Todos.Todo);
        this.set('content', todos);
        return;
      }
      
      var q = SC.Query.create({
        conditions: "title = %@",
        parameters: [tag_query],
        recordType: Todos.Tag
      });
      
      var todos = [];
      
      var tags = Todos.store.find(q);
      if(tags)
        todos = tags.mapProperty('todos').flatten();
      
      this.set('content', todos);
    },
    
    removeTag: function(button) {
      var todo = button.parentView.parentView.parentView.content;
      var tag = button.parentView.content;
      todo.removeTag(tag);
    }
    
  });

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });

  var todos = Todos.store.find(Todos.Todo);
  Todos.todoListController.set('content', todos);
});