-include .env

build:; forge build


deploy-sepolia:; 
forge script script/DeployFundMe.s.sol:DeployFundMe --rpc-url $(Sepolia_URl) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API)
# forge script script/DeployFundMe.s.sol:DeployFundMe --rpc-url $Sepolia_URl --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API