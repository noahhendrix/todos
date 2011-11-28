describe('Todo', function() {
  var todo, tag;
  
  beforeEach(function() {
    todo = Todos.store.createRecord(Todos.Todo, { title: 'Tag me up, Scotty!' }, 100);
    tag = Todos.store.createRecord(Todos.Tag, { title: 'title' }, 100);
  });
  
  afterEach(function() {
    Todos.store.reset();
  });
  
  describe('addTag', function() {
    it('it associates the tag', function() {
      todo.addTag(tag);
      expect(todo.get('tags')).toContain(tag);
    });
  });
  
  describe('removeTag', function() {
    beforeEach(function() {
      todo.addTag(tag);
    });
    
    it('it disassociates the tag', function() {
      expect(todo.get('tags')).toContain(tag); //now you see it
      todo.removeTag(tag);
      expect(todo.get('tags')).not.toContain(tag); //now you don't
    });
  });
});