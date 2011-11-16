// ==========================================================================
// Project:   Todos
// Copyright: @2011 Noah Hendrix
// ==========================================================================
/*globals Todos */

Todos = SC.Application.create();

// Models
  Todos.Todo = SC.Object.extend({
    title: null,
    isDone: false
  });

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });
});