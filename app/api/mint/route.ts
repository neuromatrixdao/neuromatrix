import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SolanaAgentKit } from 'solana-agent-kit';
import { PublicKey } from '@solana/web3.js';
import { MetadataService } from '@/app/services/metadata';

export const maxDuration = 30;

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

    // Generate metadata for the NFT
    const metadata = MetadataService.generateMetadata(
      process.env.CREATOR_ADDRESS || process.env.SOLANA_PRIVATE_KEY!
    );

    const result = await agent.mintNFT(
        new PublicKey(process.env.NEURO_MATRIX_COLLECTION_ADDRESS!),
        {
            name: metadata.name,
            uri: metadata.uri,
            sellerFeeBasisPoints: metadata.seller_fee_basis_points,
            creators: metadata.properties.creators.map(creator => ({
                address: creator.address,
                share: creator.share
            }))
        },
        new PublicKey(walletAddress)
    );

    return NextResponse.json({
      success: true,
      nftAddress: result.mint.toString(),
      walletAddress,
      metadata,
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