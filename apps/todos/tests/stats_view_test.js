var view = new Todos.StatsView;
describe('StatsView', function() {
  
  describe('displayRemaining', function() {
    beforeEach(function() {
      SC.RunLoop.begin();
        Todos.todoListController.createTodo('This is remaining');
        Todos.todoListController.createTodo('This is not remaining', true);
      SC.RunLoop.end();
    });
    
    afterEach(function() {
      Todos.store.reset();
    });
    
    it('returns the remaining todos count', function() {
      var remaining = view.displayRemaining();
      expect(remaining).toBe('1 item');
    });
  });
});