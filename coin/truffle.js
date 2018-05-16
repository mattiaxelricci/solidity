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
         from: "0xA12815106716D71c999fec63717d9A90B976ae75",
         gas: 2900000,
         gasPrice: 10000000000,

    }
      },
       rpc: {
     host: 'localhost',
     post:8080
       }
    };
