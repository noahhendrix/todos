var controller = Todos.todoListController;
describe('todoListController', function() {
  
  describe('methods',function(){
    var uncompleted, completed;
    
    beforeEach(function() {
      SC.RunLoop.begin();
        uncompleted = controller.createTodo('Fail this test');
        completed = controller.createTodo('Pass this test', true);
      SC.RunLoop.end();
    });
    
    afterEach(function(){
      Todos.store.reset();
    });
  
    describe('createTodo', function() {
      it('adds todo to content', function() {
        expect(controller.content).toContain(uncompleted);
        expect(controller.content).toContain(completed);
      });
    
      it('sets the title from first argument', function() {
        var title = controller.objectAt(1).get('title');
        expect(title).toBe('Pass this test');
      });
    
      it('defaults isDone to false if no second argument', function() {
        var isDone = controller.objectAt(0).get('isDone');
        expect(isDone).toBeFalsy();
      });
    
      it('sets isDone from the second argument', function() {
        var isDone = controller.objectAt(1).get('isDone');
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
  
  });
});
