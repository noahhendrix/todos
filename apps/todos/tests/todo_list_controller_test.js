var controller = Todos.todoListController;
describe('todoListController', function() {
  var uncompleted, completed;
  
  beforeEach(function() {
    SC.RunLoop.begin();
    uncompleted = controller.createTodo('Fail this test');
    completed = controller.createTodo('Pass this test', true);
    SC.RunLoop.end();
  });
  
  afterEach(function() {
    Todos.store.reset();
  });

  describe('createTodo', function() {
    it('adds todo to content', function() {
      expect(controller.content).toContain(uncompleted);
      expect(controller.content).toContain(completed);
    });
  
    it('sets the title from first argument', function() {
      var title = completed.get('title');
      expect(title).toBe('Pass this test');
    });
  
    it('defaults isDone to false if no second argument', function() {
      var isDone = uncompleted.get('isDone');
      expect(isDone).toBeFalsy();
    });
  
    it('sets isDone from the second argument', function() {
      var isDone = completed.get('isDone');
      expect(isDone).toBeTruthy();
    });
  });

  describe('remaining', function() {
    it('returns count of uncompleted only', function() {
      expect(controller.content.length()).toBe(2);
      expect(controller.remaining()).toBe(1);
    });
  
    it('returns 0 when all todos are completed', function() {
      uncompleted.set({isDone: true});
      expect(controller.remaining()).toBe(0);
    });
  });

  describe('clearCompletedTodos', function() {
    it('destroys only completed', function() {
      expect(completed.isDestroyed()).toBeFalsy();
      controller.clearCompletedTodos();
      expect(completed.isDestroyed()).toBeTruthy();
      expect(uncompleted.isDestroyed()).toBeFalsy();
    });
  });

  describe('allAreDone', function() {
    it('sets all isDone to second argument', function() {
      controller.allAreDone(null, false);
      expect(uncompleted.get('isDone')).toBeFalsy();
      expect(completed.get('isDone')).toBeFalsy();
    });
  });
  
  describe('filterByTag', function() {
    var on_both, on_one;

    beforeEach(function() {
      on_both = Todos.store.createRecord(Todos.Tag, { title: 'on both' }, 200);
      on_one = Todos.store.createRecord(Todos.Tag, { title: 'on one' }, 300);

      completed.addTag(on_one);
      completed.addTag(on_both);
      uncompleted.addTag(on_both);
    });

    it('shows only todos tagged with filter', function() {
      controller.filterByTag('on one');
      expect(controller.content).toContain(completed);
      expect(controller.content).not.toContain(uncompleted);
    });

    it('shows all todos if multiple are tagged with filter', function() {
      controller.filterByTag('on both');
      expect(controller.content).toContain(completed);
      expect(controller.content).toContain(uncompleted);
    });
    
    it('shows all if no query', function() {
      controller.filterByTag('');
      expect(controller.content).toContain(completed);
      expect(controller.content).toContain(uncompleted);
    });
  });
});