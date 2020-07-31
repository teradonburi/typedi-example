import "reflect-metadata";
import { Container, Service, Inject } from 'typedi';

interface Factory {
  create(): void;
}

@Service('bean.factory')
class BeanFactory implements Factory {
  create() {
    console.log('create bean')
  }
}

@Service()
class SugarFactory implements Factory {
  create() {
    console.log('create sugar')
  }
}

@Service()
class WaterFactory implements Factory {
  create() {
    console.log('create water')
  }
}

@Service('coffee.maker')
class CoffeeMaker {
  // inject by class id
  @Inject('bean.factory')
  beanFactory!: Factory;

  // inject by class type
  @Inject()
  sugarFactory!: SugarFactory;

  @Inject()
  waterFactory!: WaterFactory;

  make() {
    this.beanFactory.create();
    this.sugarFactory.create();
    this.waterFactory.create();
  }
}

let coffeeMaker = Container.get<CoffeeMaker>('coffee.maker');
// also get by class type
// let coffeeMaker = Container.get(CoffeeMaker);
coffeeMaker.make();


// for test
class FakeBeanFactory implements Factory {
  create() {
    console.log('fake bean')
  }
}

class FakeCoffeeMaker {
  @Inject('bean.factory')
  beanFactory!: Factory;

  make() {
    this.beanFactory.create();
  }
}

// replace CoffeeMaker to mock for test
Container.set('bean.factory', new FakeBeanFactory())
Container.set('coffee.maker', Container.get(FakeCoffeeMaker))

let fakeCoffeeMaker = Container.get<CoffeeMaker>('coffee.maker');
fakeCoffeeMaker.make();

