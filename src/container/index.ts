const kInstances = Symbol('instances');

interface Injection {
  index: number;
  key: string;
}

type Constructor<T> = { new (...args: any[]): T };

export const container = {
  [kInstances]: new Map(),

  register<T>(key: string, AnyClass: Constructor<T>) {
    if (this[kInstances].has(key)) return;
    this[kInstances].set(key, new AnyClass());
  },

  get<T = unknown>(key: string): T {
    return this[kInstances].get(key);
  },

  resolve<T>(InjectableClass: Constructor<T>) {
    return new InjectableClass();
  },
};

export function Injectable() {
  return function injectTarget<T extends Constructor<any>>(constructor: T): T | void {
    return class extends constructor {
      constructor(...args: any[]) {
        const injections = (constructor as any).injections as Injection[];
        const injectedArgs: any[] = injections
          .sort((a, b) => a.index - b.index)
          .map(({ key }) => container.get(key));

        super(...injectedArgs);
      }
    };
  };
}

export function Inject(key: string) {
  return function injectTarget(target: Object, _key: string | symbol, parameterIndex: number) {
    const injection: Injection = { index: parameterIndex, key };
    const existingInjections: Injection[] = (target as any).injections || [];

    Object.defineProperty(target, 'injections', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: [...existingInjections, injection],
    });
  };
}
