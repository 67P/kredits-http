const express = require('express');
const Kredits = require('kredits-contracts');
const ethers = require('ethers');
const app = express();
const port = 3000;

const NO_PARAM = () => {};
const ID_PARAM = (params) => { console.log('params', params); return params.id };

const endpoints = {
  Contributor: {
    all: NO_PARAM,
    getById: ID_PARAM
  }
}
let provider = ethers.getDefaultProvider('rinkeby');

new Kredits(provider, null, {apm: 'open.aragonpm.eth'}).init().then(kredits => {
  Object.keys(endpoints).forEach(contractName => {
    const methods = endpoints[contractName];
    Object.keys(methods).forEach(methodName => {
      app.get(`/${contractName.toLowerCase()}/${methodName.toLowerCase()}`, (req, res) => {
        let params = methods[methodName](req.query);
        kredits[contractName][methodName](params).then(ret => {
          res.send(ret);
        }).catch(e => {
          res.status(500).send(e);
        })
      });
    })
  });
  app.listen(port, () => console.log(`Kredits listening on port ${port}!`))
})

