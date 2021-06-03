# Js-database - library for simple indexeddb usage

## **Usage guide**

### **Let's start**

First what you need to do is install this library to yours project:

```bash
npm i js-database --save
```

### **Create model**

Next step create your first storage model. You can do it easily:

```javascript
import { BaseStorage } from "js-database";

export class TestStorage extends BaseStorage {
  model = {
    name: "Test",
    params: {
      keyPath: "id",
    },
  };
}
```

if you don't whant or your data haven't unique id to be used for keyPath you can add autoincrement option to yours model:

```javascript
import { BaseStorage } from "js-database";

export class TestStorage extends BaseStorage {
  model = {
    name: "Test",
    params: {
      autoIncrement: true,
    },
  };
}
```

### **Initialize database**

After creating yours storage class, you need to initialize database like that:

```javascript
import { initializeDatabase } from "js-database";

initializeDatabase("TEST", 1, TestStorage);
```

That's it! Now you can use "TestStorage" for storing data

Now let's talk how to work with our storage

### **Waiting for initialization**

In some cases for example when database is updating you need to hold of using database from your app. For that case you can subscribe for 'ready' event that fires when database is ready for accept transactions

For react users:

```javascript
import React, { useState } from "react";
import { useStorageInit } from "js-database";

const Component = () => {
  const [isReady, setReady] = useState(false);

  useStorageInit(() => {
    setReady(true);
  });

  if (isReady) return <>Some code</>;

  return <></>;
};
```

For vanilla js:

```javascript
import { subscribeForDatabaseReady } from "js-database";

subscribeForDatabaseReady(() => {
  //do something
});
```

### **Set data to storage**

Basic adding:

```javascript
TestStorage.storage.setItem({
  id: 1,
  data: { any: { type: { of: "data" } } },
});
```

> [!WARNING]
> setItem applyes object that corresponds to yours storage model - if you add keyPath to params it must be in object that you put to the setItem method
> in this example this id property "id"

You can provide second argument for setItem to update particular item in storage:

```javascript
TestStorage.storage.setItem(
  {
    data: { any: { type: { of: "data" } } },
  },
  key
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

### **Removing items**

Remuve single item:

```javascript
TestStorage.storage.removeItem(id);
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
import { useStorageEvent } from "js-database";
import { TestStorage } from "test-storage";

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
import { subscribeForChanges } from "js-database";
import { TestStorage } from "test-storage";

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
