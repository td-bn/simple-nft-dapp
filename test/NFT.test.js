const { expect } = require("chai")

describe('NFTs', () => {
  let nft
  let admin, alice, bob

  beforeEach(async () => {
    [admin, alice, bob] = await ethers.getSigners()
    const NFT = await ethers.getContractFactory("INFT")
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
      expect(await nft.name()).to.equal('IdenticonNFT')
      expect(await nft.symbol()).to.equal('INFT')
    })
  })

  describe('minting', () => {
    it('should increment id when NFT minted correctly', async () => {
      await nft.connect(admin).mint(alice.address, 'alice.nft.uri')
      expect(await nft.nextTokenId()).to.equal(1)
    })

    it('should emit event if minted correctly', async () => {
      await expect(nft.connect(admin).mint(alice.address, 'alice.nft.uri'))
        .to.emit(nft, "Mint")
        .withArgs(0, alice.address, 'alice.nft.uri')
    })
  })
  
  describe('tokenURI', () => {
    it('should get the correct URI for a token', async () => {
      await nft.connect(admin).mint(alice.address, 'alice.nft.uri') 
      const URI = await nft.tokenURI(0)
      expect(URI).to.equal('alice.nft.uri')
    })
  })

  describe('approval', () => {
    it('should emit event when approved for sale', async () => {
      await nft.connect(admin).mint(alice.address, '') 
      await expect(nft.connect(alice).approve(nft.address, 0))
        .to.emit(nft, "Approve")
        .withArgs(0, nft.address)
    })
    
  })
  

  describe('buying', () => {
    it('should pass ownership of NFT', async () => {
      await nft.connect(admin).mint(alice.address, '') 
      await nft.connect(alice).approve(nft.address, 0)
      
      nft.connect(bob).buy(0)
      const owner = await nft.ownerOf(0)
      expect(owner).to.equal(bob.address)
    })

    it('should emit event if ownership of NFT is passed', async () => {
      await nft.connect(admin).mint(alice.address, '') 
      await nft.connect(alice).approve(nft.address, 0)
      
      await expect(nft.connect(bob).buy(0))
        .to.emit(nft, "Buy")
        .withArgs(0, bob.address)
    })

    it('should pass not pass ownership of NFT if contract not approved for sale', async () => {
      await nft.connect(admin).mint(alice.address, '') 
      // await nft.connect(alice).approve(nft.address, 0)
      
      await expect(nft.connect(bob).buy(0))
        .to.be.revertedWith('contract not approved to perform transaction')
    })
    
  })
  
})
