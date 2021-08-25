const { expect } = require("chai")

describe('NFTs', () => {
  let nft
  let admin, alice

  beforeEach(async () => {
    [admin, alice] = await ethers.getSigners()
    const NFT = await ethers.getContractFactory("AnimalNFT")
    nft = await NFT.connect(admin).deploy()
  })

  describe('Deployment', () => {
    it('should get deployed to a non-zero address', async () => {
      expect(nft.address).not.to.equal(ethers.constants.AddressZero)
    })

    it('should set the correct admin', async () => {
      expect(await nft.admin()).to.equal(admin.address)
    })
    
    it('should have the correct metadata', async () => {
      expect(await nft.name()).to.equal('AnimalNFT')
      expect(await nft.symbol()).to.equal('ANFT')
    })
  })

  describe('minting', () => {
    it('should not allow non-admins to mint', async () => {
      await expect(nft.connect(alice).mint(alice.address)) 
        .to.revertedWith('only admin')
    })
    
    it('should increment id when NFT minted correctly', async () => {
      await nft.connect(admin).mint(alice.address) 
      expect(await nft.nextTokenId()).to.equal(1)
    })
  })
  
  describe('tokenURI', async () => {
    it('should get the correct URI for a token', async () => {
      await nft.connect(admin).mint(alice.address) 
      const URI = await nft.tokenURI(0)
      expect(URI).to.equal('https://lossy-nft-server.herokuapp.com/0')
    })
    
  })
})
