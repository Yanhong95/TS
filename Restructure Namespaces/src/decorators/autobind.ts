namespace App {
  export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false, // 不能iteration
      get() {
        //下面这个this, 永远指向的是拥有这个get方法的class, 然后这个get方法是当前这个class的隐藏方法,所以这个this就是我们
        //decorate的function所属的class, 所以这个this就指向printerclass, 所以这里这个boundFn就bind了printer.
        const boundFn = originalMethod.bind(this);
        return boundFn;
      }
    };
    // overrite 旧的 descriptor
    return adjDescriptor;
  }

}