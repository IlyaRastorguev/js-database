# Js-database

## **library for simple indexeddb usage**

### **LIMITATION**

> [!WARNING]
> Firefox disable indexedDB in private mode, be careful.
> I hope, this will change soon


### **Let's start**

First what you need to do is install this library to yours project:

```bash
npm i js-database --save
```

### **Create model**

Next step create your first storage model. You can do it easily:

```javascript
import {BaseStorage} from "js-database";

export class TestStorage extends BaseStorage {
  static storage = new TestStorage()

  model = {
    name: "Test",
    params: {
      keyPath: "id",
    },
  };

  // this method calls on first storage initialization and when db version increments
  applyMigrations(objectStore: IDBObjectStore) {
    objectStore.createIndex("is_enabled", "enabled"); //you can create indexies
    this.setItem({}) //you can set default values to storage
  }
}
```

if you don't whant or your data haven't unique id to be used for keyPath you can add autoincrement option to yours
model:

```javascript
import {BaseStorage} from "js-database";

export class TestStorage extends BaseStorage {
  model = {
    name: "Test",
    params: {
      autoIncrement: true,
    },
  };
}
```

### **Initialize database (Vanila)**

After creating yours storage class, you need to initialize database like that:

```javascript
import {initDatabase} from "js-database";

initDatabase("TEST", 1, () => fireAfterInitialization(), TestStorage);
```

That's it! Now you can use "TestStorage" for storing data

Now let's talk how to work with our storage

### **Initialize database (react)**
For react users:

```javascript
import React, {useState} from "react";
import {useStorageInit} from "js-database";
import {ToDoStorage} from "./todo"

const Component = () => {
  const [isReady, setReady] = useState(false);

  useStorageInit("MyStorage", 1, () => {
    setReady(true);
  }, ToDoStorage);

  if (isReady) return <>Some code</>;

  return <></>;
};
```

### **Set data to storage**

Basic adding:

```javascript
TestStorage.storage.setItem({
  id: 1,
  data: {any: {type: {of: "data"}}},
});
```

> [!WARNING]
> setItem applyes object that corresponds to yours storage model - if you add keyPath to params it must be in object that you put to the setItem method.
> In this example this is property "id"

You can provide second argument for setItem to update particular item in storage:

```javascript
TestStorage.storage.setItem(
  {
    data: {any: {type: {of: "data"}}},
  },
  key
);
```

You can set list of items like that:

```javascript
TestStorage.storage.setItems(
  [
    {
      data: {any: {type: {of: "data"}}},
    },
    {
      data: {any: {type: {of: "data"}}},
    }
  ]
);
```

Method used for partial update of storage item:

```javascript
TestStorage.storage.partialUpdate(key, {fieldToUpdate: "value"});
```

Method used for partial update items that matches with query

```javascript
TestStorage.storage.partialUpdateByQuery({fieldToUpdate: "value"}, query, index);
```

Method used for partial update all items in storage

```javascript
TestStorage.storage.partialAllUpdate(
  {fieldToUpdate: "value"}
);
```

### **Get item**

Basic getter:

```javascript
TestStorage.storage
  .getItem(key)
  .then((item) => {
    setItem(item);
  })
  .catch((e) => {
    console.warn(e);
  });
```

Get all items as list:

```javascript
TestStorage.storage
  .getAllItems()
  .then((items) => {
    setList(items);
  })
  .catch((e) => {
    console.warn(e);
  });
```

Get all items as Map object:

```javascript
TestStorage.storage
  .getAllItemsWithKeys()
  .then((items) => {
    setList(items);
  })
  .catch((e) => {
    console.warn(e);
  });

```

Get items filtered by index:

```javascript
TestStorage.storage
  .getItemsByQuery(query, index) // index is optional
  .then((items) => {
    setList(items);
  })
  .catch((e) => {
    console.warn(e);
  });
```

You can create queries using Query class:

```javascript
import {Query} from "js-database";

Query.bound("A", "B", true, true)

Query.lowerBound("A", true)

Query.upperBound("B", true)

Query.only("value")

Query.many("value1", "value2")

```

for more information visit https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange

### **Removing items**

Remove single item:

```javascript
TestStorage.storage.removeItem(id);
```

Remove items matching query:

```javascript
TestStorage.storage.removeItemByQuery(query, index) // index is optional
```

Remove all items:

```javascript
ToDoStorage.storage.removeAllItems();
```

### **Subscribe on changes**

You can subscribe on storage changes to provide actual state of yours app components

For React users:

```javascript
import React from "react";
import {useStorageEvent} from "js-database";
import {TestStorage} from "test-storage";

const Component = () => {
  const doSomeThingOnAddingNewItems = useCallback(() => {
    //do some operations
  }, []);

  const doSomeThingOnRemovingItems = useCallback(() => {
    //do some operations
  }, []);

  useStorageEvent(
    TestStorage,
    doSomeThingOnAddingNewItem,
    doSomeThingOnRemovingItems
  );

  return <></>;
};
```

For vanilla js:

```javascript
import {subscribeForChanges} from "js-database";
import {TestStorage} from "test-storage";

const doSomeThingOnAddingNewItems = () => {
  //do some operations
};

const doSomeThingOnRemovingItems = () => {
  //do some operations
};

subscribeForChanges(
  TestStorage,
  doSomeThingOnAddingNewItems,
  doSomeThingOnRemovingItems
);
```

### **Demo**

Little demo for more understanding
[view on codesandbox.io](https://codesandbox.io/s/js-database-demo-nc04n)
