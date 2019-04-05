const express = require('express');
const Kredits = require('kredits-contracts');
const ethers = require('ethers');
const app = express();
const port = 3000;

const NO_PARAM = () => null;
const ID_PARAM = (params) => params.id;
const ADDRESS_PARAM = (params) => params.address;
const ALL_PARAMS = (params) => params;

const endpoints = {
  Contributor: {
    all: NO_PARAM,
    getById: ID_PARAM,
    filterByAccount: ALL_PARAMS,
    findByAccount: ALL_PARAMS,
    contributorsCount: NO_PARAM,
  },
  Contribution: {
    all: NO_PARAM,
    getById: ID_PARAM,
    getByContributorId: ID_PARAM,
    getByContributorAddress: ADDRESS_PARAM,
    contributionsCount: NO_PARAM
  },
  Proposal: {
    all: NO_PARAM,
    getById: ID_PARAM,
    proposalsCount: NO_PARAM
  }
}
let provider = ethers.getDefaultProvider('rinkeby');

new Kredits(provider, null, {apm: 'open.aragonpm.eth'}).init().then(kredits => {
  Object.keys(endpoints).forEach(contractName => {
    const methods = endpoints[contractName];
    Object.keys(methods).forEach(methodName => {
      app.get(`/${contractName.toLowerCase()}/${methodName.toLowerCase()}`, (req, res) => {
        let params = methods[methodName](req.query);
        let func;
        let result;
        if (kredits[contractName][methodName]) {
          result = kredits[contractName][methodName](params);
        } else {
          result = kredits[contractName].functions[methodName](params);
        }
        result.then(ret => {
          res.json(ret);
        }).catch(e => {
          console.log(e);
          res.sendStatus(500);
        })
      });
    })
  });
  app.listen(port, () => console.log(`Kredits listening on port ${port}!`))
})

