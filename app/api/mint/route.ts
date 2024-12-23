import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SolanaAgentKit } from 'solana-agent-kit';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const agent = new SolanaAgentKit(
        process.env.SOLANA_PRIVATE_KEY!, 
        process.env.RPC_URL, 
        process.env.OPENAI_API_KEY!
    );

    const result = await agent.mintNFT(
        new PublicKey(process.env.NEURO_MATRIX_COLLECTION_ADDRESS!),
        {
            name: 'NeuroMatrix Green Rain Pass',
            uri: 'https://example.com/nft-metadata',
        },
        new PublicKey(walletAddress)
    );

    return NextResponse.json({
      success: true,
      nftAddress: result.mint.toString(),
      walletAddress,
      message: 'NFT minted successfully'
    });

  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
} 