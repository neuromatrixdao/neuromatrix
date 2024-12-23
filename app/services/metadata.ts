export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  animation_url?: string;
  external_url: string;
  uri: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  properties: {
    files: {
      uri: string;
      type: string;
    }[];
    category: string;
    creators: {
      address: string;
      share: number;
    }[];
  };
  collection: {
    name: string;
    family: string;
  };
}

export class MetadataService {
  private static getDomain(): string {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    if (!domain) {
      throw new Error('NEXT_PUBLIC_DOMAIN environment variable is not set');
    }
    return domain;
  }

  private static get baseUrl(): string {
    return `https://${this.getDomain()}`;
  }

  private static get baseMetadataUrl(): string {
    return `${this.baseUrl}/nft/metadata`;
  }

  static generateMetadata(creatorAddress: string): NFTMetadata {
    const timestamp = Date.now();
    const metadataFilename = `nft-${timestamp}.json`;

    return {
      name: "NeuroMatrix Pass",
      symbol: "NMP",
      description: "Enter the code. Unlock hidden realms of AI-driven cyberpunk. Rewrite your reality—join the NeuroMatrix",
      seller_fee_basis_points: 500,
      image: `${this.baseUrl}/neuromatrixpass.jpeg`,
      external_url: this.baseUrl,
      uri: `${this.baseMetadataUrl}/${metadataFilename}`,
      attributes: [
        {
          trait_type: "Series",
          value: "NeuroMatrix Pass"
        },
        {
          trait_type: "Matrix Code Style",
          value: "Green Rain"
        },
        {
          trait_type: "AI Artwork Level",
          value: "Ultra"
        },
        {
          trait_type: "Background",
          value: "Holographic Tech"
        },
        {
          trait_type: "Rarity",
          value: "Rare"
        }
      ],
      properties: {
        files: [
          {
            uri: `${this.baseUrl}/neuromatrixpass.jpeg`,
            type: "image/jpeg"
          }
        ],
        category: "image",
        creators: [
          {
            address: creatorAddress,
            share: 100
          }
        ]
      },
      collection: {
        name: "NeuroMatrix NFT Collection",
        family: "NeuroMatrix"
      }
    };
  }
} 