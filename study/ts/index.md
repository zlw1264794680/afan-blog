# ts

演武场：https://www.typescriptlang.org/zh/play/

ts类型定义器：https://tsdiagram.com/



## 可选类型 Partial


```ts
interface CreateUser {
    name: string;
    age: number;
}

type UpdateUser = Partial<CreateUser>;

```

## 泛型

```ts
interface Options<T = unknown> {
    label: string;
    value: T;
}


const op:Options<string> = {
    label:'test',
    value:'test'
}
```