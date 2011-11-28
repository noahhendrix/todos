var view = new Todos.CreateTodoView;
describe('CreateTodoView', function() {
  
  describe('insertNewline', function() {
    afterEach(function() {
      Todos.store.reset();
    });
    
    it('creates a new todo titled with value', function() {
      view.set('value', 'Hello World!');
      var todo = view.insertNewline();
      var title = todo.get('title');
      expect(title).toBe('Hello World!');
    });
  });
});