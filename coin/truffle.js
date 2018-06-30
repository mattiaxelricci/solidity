module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
  ropsten:  {
         network_id: 3,
         host: "localhost",
         port:  8545,
         from: "0xF25C2e824f6C735520F2149f42696afBb29eA22A",
         gas: 14899999,
         gasPrice: 1,

    }
      },
       rpc: {
     host: 'localhost',
     post:8080
   }
    };
