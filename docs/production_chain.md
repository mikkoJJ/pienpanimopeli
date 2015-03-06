Production Chain Objects
========================

`Producer`
----------

A `Producer` is a generic object that represents one step in the production chain.

### Members

#### `Producer.beer` {`Brew.Beer`}

Every `Producer` has a reference to the `Beer` object that is being processed. It is instantiated in the first step of the process.

#### `Producer.state` {`Number`} 

A `Producer` is always in one of the following states: `IDLE`, `PROCESSING`, `DONE`. When done processing, it will stay in the `DONE` state until the next step in the chain is able to continue production (ie. reaches the `IDLE` state). 

#### `Producer.update()`

Called by the game to keep the producer updating.

### Derived classes

The production steps derived from it are:

`Lauterer`

`Fermenter`

`Maturer`

`Bottler`