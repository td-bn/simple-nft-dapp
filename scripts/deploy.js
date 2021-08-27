async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFT = await ethers.getContractFactory("AnimalNFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("Contract address:", nft.address);

  await nft.mint(deployer.address);
  await nft.mint(deployer.address);
  await nft.mint(deployer.address);

  await nft.approve(nft.address, 0)
  await nft.approve(nft.address, 1)
  saveFrontendFiles(nft);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ AnimalNFT: contract.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("AnimalNFT");

  fs.writeFileSync(
    contractsDir + "/AnimalNFT.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
