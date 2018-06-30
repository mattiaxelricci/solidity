module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
<<<<<<< HEAD
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
=======
      network_id: "1337" // Match any network id
    }
  /*  ropsten:  {
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
     post:8080*/
>>>>>>> 5de84e81df7a6e2f8f781d4e7f0278f2ae301952
   }
    };
