# Notes
interface -> model (schema) -> schemes (validation) -> controller -> route
- services:
    - db: interact with main db (mongodb)
    - queues: create job (handeling from workers) and add to queue
    - redis: interact with redis
    - sockets: implement socket
    - workers: handling job (interact with main db)
## TypeScript
- Exclamation mark (`!`): tells the TypeScript compiler that a value typed as optional cannot be null or undefined
- Question mark (`?`): Optional
- Way to create decorator (detail in *`shared/globals/decorators`*)
- Why use prototype instead of this (detail in *`features/auth/controllers/signup.ts`*)
```
the reason using SignUp.prototype.signupData and not this.signupData is because of how we invoke the create method in the routes method. the scope of the this object is not kept when the method is invoked
```
- Why cast as `unknown` type first?
```
To make that value become no type to easier cast to another type
Sometimes that value overlap some type of the interface so need to cast unknown first
```
- Reason why some class only `export class` and some `export instance` because some `export class` if using `export instance` will have some connection error
## MongoDB
- aggregate: (detail in *`shared/services/redis/user.cache.ts`*)
  + is more efficient than findById, findOne, ..., cuz have more options
  + always returns in list
  + `$match`: same as UserModel.findOne({ _id: userId })
  + `$lookup`: (nearly same as populate)
    + from: which collections want to reference
    + localField: which field use to reference
    + as: return inside property defined
  + `$unwind`: instead aggregate return as an array, it returns as an object and get access to it
  + `$project`: Actual return the field in data want to return
    + Set as 0: excluded that data
    + Set as 1: included that data
    + Set as '$authId.field' (can only be used if has` $unwind`)
- compare SQL with Aggregate:

|SQL command|Aggregation framework operator|
|:---:|---|
|SELECT|$project, $group functions: $sum, $min, etc.|
|FROM|db.collectionName.aggregate(...)|
|JOIN|$unwind|
|GROUP BY|$group|
|HAVING|$match|
## Redis
- Types data in Redis
1. Strings
2. Lists
3. Sets
4. Hashes
```
HGET: Get the value of a hash field
HINCRBY: Inc the integer value of a hash field by the given number
HLEN: Get number of fields in hash
HGETALL: Get all the fields and values in a hash
HMGET: Get the values of all the given hash fields
HSET: Set the string value of a hash field
```
5. Sorted Set (ZSET)
- (detail in *`shared/services/redis/user.cache.ts`*)
```
- to store in redis need to convert as a list and value will be string
  + even index: Field
  + odd index: value
- redis stored as string, need to convert back to original type before send back to client
```