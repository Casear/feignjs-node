# Feignjs-request
Plain Node-client for [FeignJs](https://github.com/feignjs/feignjs) (using http.request)


## Installation
```
npm install feignjs-node
```

## Getting started
this library can be used as client for feign:

```
feign.builder()
	.client(new FeignNode())        
    .target(restDescription, 'http://jsonplaceholder.typicode.com');
```


## Options
The constructor accepts an options-object:

| Option | Note | default
|---|---|---|
| defaults | defaults to be used | {} |



