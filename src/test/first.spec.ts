import { expect } from 'chai';

import { Schedule } from '../schedule';
import { Problem } from '../interfaces';
import { LpSolver } from '../lpSolver';
import { BruteSolver } from '../bruteSolver';


describe("Check optimun results", () => {
  describe("Original statement", () => {
    it("Obtains the best possible result", () => {
      let lpRes = 0,
        bfRes = 0;

      const schedule = new Schedule('data/statement.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 
      
      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
      });
      problems.forEach(problem => {
        const solver = new BruteSolver(problem);
        bfRes += solver.solve();
    
      });

      expect(lpRes).to.be.eq(bfRes);
    });
  });

  describe("Many days case", () => {
    it("Obtains the best possible result", () => {
      let lpRes = 0,
        bfRes = 0;

      const schedule = new Schedule('data/manyDays.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 
      
      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
    
      });
      problems.forEach(problem => {
        const solver = new BruteSolver(problem);
        bfRes += solver.solve();
    
      });

      expect(lpRes).to.be.eq(bfRes);
    });
  });

  describe("100 short tasks", () => {
    it("Obtains the best possible result", () => {
      let lpRes = 0,
        bfRes = 0;

      const schedule = new Schedule('data/100ShortTasks.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 
      
      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
    
      });
      problems.forEach(problem => {
        const solver = new BruteSolver(problem);
        bfRes += solver.solve();
    
      });

      expect(lpRes).to.be.eq(bfRes);
    });
  });
});


const oneSecond = 1000;


describe("Test ffficiency", function() {
  this.timeout(5000);
  describe("A lot of tasks", () => {
    it("Should take less than one second", () => {
      let lpRes = 0,
        time: number;
      const tick = Date.now();

      const schedule = new Schedule('data/lotsOfTasks.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 
      
      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
      });
      
      time = Date.now() - tick;

      expect(time).to.be.lte(3 * oneSecond);

    });
  });

  describe("A lot of days", () => {
    it("Should take less than three seconds", () => {
      let lpRes = 0,
        time: number;
      const tick = Date.now();

      const schedule = new Schedule('data/lotsOfDays.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 
      
      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
      });
      
      time = Date.now() - tick;

      expect(time).to.be.lte(3 * oneSecond);
    });
  });


  describe("A lot of tasks and days", () => {
    it("Should take less than three seconds", () => {
      let lpRes = 0,
        time: number;
      const tick = Date.now();

      const schedule = new Schedule('data/monsterCase.json');
      const problems:Problem[] = schedule.getDividedSchedule(); 

      problems.forEach(problem => {
        const solver = new LpSolver(problem);
        lpRes += solver.solve();
      });

      time = Date.now() - tick;

      expect(time).to.be.lte(3 * oneSecond);
    });
  });
});
