module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ]
  },
  "electronPackagerConfig": {
    "name": 'GeotechTools',
    "win32metadata": {
      "ProductName": 'GeotechTools',
      "InternalName": 'GeotechTools',
      "CompanyName":"MineGeotech"
    },
    "overwrite": true

  },
  "electronWinstallerConfig": {
    "name": "GeotechTools",
    "companyName":"MineGeotech",
    "productName":"Geotech Tools",
    "packageName":"GeotechTools"
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "muzbox",

    "name": "https://github.com/MineGeotech/gtechtools"
  },
  "windowsStoreConfig": {
    "packageName": "gtechtools"
  }
};