import { NextRequest, NextResponse } from 'next/server';
import { PublicKey, Connection } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { MetadataService } from '@/app/services/metadata';

export const dynamic = 'force-dynamic';

type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  symbol: string;
  collection: string;
  updateAuthority: string;
  mintAddress: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    // Get the address from params
    const { address } = await params;
    
    // Validate NFT address
    const nftAddress = new PublicKey(address);

    // Get request body if any
    const body = await req.json().catch(() => ({}));

    // First try to get local metadata
    const localMetadata = MetadataService.generateMetadata(
      process.env.CREATOR_ADDRESS || process.env.SOLANA_PRIVATE_KEY!
    );

    // Format the response with local metadata
    const metadata: NFTMetadata = {
      name: localMetadata.name,
      description: localMetadata.description,
      image: localMetadata.image,
      attributes: localMetadata.attributes,
      symbol: localMetadata.symbol,
      collection: localMetadata.collection.name,
      updateAuthority: process.env.CREATOR_ADDRESS || process.env.SOLANA_PRIVATE_KEY!,
      mintAddress: address,
      ...body // Merge any additional data from request body
    };

    // Try to get on-chain metadata in the background
    try {
      const connection = new Connection(process.env.RPC_URL || 'https://api.devnet.solana.com');
      const metaplex = new Metaplex(connection);
      const nft = await metaplex.nfts().findByMint({ mintAddress: nftAddress });

      // If we successfully got on-chain data, update some fields
      if (nft) {
        metadata.updateAuthority = nft.updateAuthorityAddress.toString();
        if (nft.collection) {
          metadata.collection = nft.collection.address.toString();
        }
      }
    } catch (err) {
      console.warn('Could not fetch on-chain metadata, using local metadata only:', err);
    }

    return NextResponse.json(metadata);

  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFT metadata' },
      { status: 500 }
    );
  }
} 